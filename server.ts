import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { EventEmitter } from "events";
import { GoogleGenAI } from "@google/genai";

// Fix MaxListenersExceededWarning
EventEmitter.defaultMaxListeners = 50;
process.setMaxListeners(50);

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Listen early to satisfy the platform's health check/proxy
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BOOT] Server listening on http://0.0.0.0:${PORT}`);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('[CRITICAL] Uncaught Exception:', error);
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Secure Image proxy endpoint to bypass CORS and 403 hotlinking restrictions (like Wikimedia and Clearbit)
  app.get("/api/proxy-image", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).send("URL parameter is required and must be a string");
    }

    try {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
      ];

      console.log(`[PROXY IMAGE] Fetching: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': 'https://commons.wikimedia.org/',
          'Connection': 'keep-alive'
        },
        responseType: 'arraybuffer',
        timeout: 15000,
        validateStatus: (status) => status === 200
      });

      const rawContentType = response.headers['content-type'];
      const contentType = typeof rawContentType === 'string' ? rawContentType : 'image/png';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours caching
      
      return res.send(Buffer.from(response.data));
    } catch (error: any) {
      console.error(`[PROXY IMAGE] Error loading ${url}:`, error.message);
      
      // Fallback: If Wikimedia thumbnail failed, try downloading raw SVG if it was a svg thumbnail
      if (url.includes('upload.wikimedia.org') && url.includes('/thumb/') && !req.query.retried) {
        try {
          // Convert thumbnail path back to raw SVG path
          // Example: https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png
          // Becomes: https://upload.wikimedia.org/wikipedia/commons/c/cd/STC-01.svg
          const parts = url.split('/');
          const thumbIndex = parts.indexOf('thumb');
          if (thumbIndex !== -1) {
            parts.splice(thumbIndex, 1); // remove 'thumb'
            parts.pop(); // remove thumbnail width-filename part (e.g. 1024px-STC-01.svg.png)
            const rawSvgUrl = parts.join('/');
            console.log(`[PROXY IMAGE] Trying Wikimedia raw SVG fallback: ${rawSvgUrl}`);
            const svgResponse = await axios.get(rawSvgUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              responseType: 'arraybuffer',
              timeout: 10000
            });
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.send(Buffer.from(svgResponse.data));
          }
        } catch (svgErr: any) {
          console.error(`[PROXY IMAGE] Raw SVG fallback also failed:`, svgErr.message);
        }
      }

      return res.status(500).send(`Failed to proxy image: ${error.message}`);
    }
  });

  // Flag to dynamically prefer gemini-3.1-flash-lite when gemini-3.5-flash exceeds limits
  let isGemini35Exhausted = false;

  // Route to generate AI content securely server-side
  app.post("/api/generate-content", async (req, res) => {
    const { prompt, systemInstruction, responseMimeType, responseSchema, model } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[SERVER AI] Missing GEMINI_API_KEY on server side.");
      return res.status(400).json({ 
        error: "مفتاح API الخاص بـ Gemini غير متوفر على الخادم. يرجى إعداده باسم GEMINI_API_KEY في صفحة الإعدادات (Settings > Secrets)." 
      });
    }

    const requestedModel = model || "gemini-3.5-flash";
    const modelsToTry: string[] = [];

    // Dynamically reorder fallback list to try gemini-3.1-flash-lite first if gemini-3.5-flash has already hit quota limits
    if (isGemini35Exhausted && requestedModel === "gemini-3.5-flash") {
      modelsToTry.push("gemini-3.1-flash-lite");
      modelsToTry.push("gemini-3.5-flash");
    } else {
      modelsToTry.push(requestedModel);
      if (requestedModel !== "gemini-3.1-flash-lite") {
        modelsToTry.push("gemini-3.1-flash-lite");
      }
    }

    // Build the robust fallback chain of safe and modern models
    const standardFallbacks = [
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-2.0-flash-lite"
    ];

    for (const f of standardFallbacks) {
      if (!modelsToTry.includes(f)) {
        modelsToTry.push(f);
      }
    }

    let lastError: any = null;
    const ai = new GoogleGenAI({ apiKey });

    for (const modelToAttempt of modelsToTry) {
      try {
        console.log(`[SERVER AI] Attempting generateContent with model: ${modelToAttempt}`);
        const response = await ai.models.generateContent({
          model: modelToAttempt,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: responseMimeType || (responseSchema ? "application/json" : "text/plain"),
            responseSchema
          }
        });

        console.log(`[SERVER AI] Success with model: ${modelToAttempt}`);
        return res.json({ text: response.text });
      } catch (error: any) {
        lastError = error;
        const errStr = error.message || String(error);
        
        // If we hit a quota limit on gemini-3.5-flash, dynamically flag it to bypass redundant failures in subsequent calls
        if (modelToAttempt === "gemini-3.5-flash" && (
          errStr.toLowerCase().includes("quota") ||
          errStr.toLowerCase().includes("429") ||
          errStr.toLowerCase().includes("resource_exhausted") ||
          errStr.toLowerCase().includes("limit")
        )) {
          isGemini35Exhausted = true;
          console.warn("[SERVER AI] Detected 429 quota exhaustion on gemini-3.5-flash. Switching primary generation model to gemini-3.1-flash-lite.");
        }

        // Use console.warn for handled/caught fallback attempts so it is excluded from platform severity monitoring
        console.warn(`[SERVER AI] generateContent warning on model ${modelToAttempt} (falling back):`, errStr);
      }
    }

    // If both/all attempted models failed, format the error safely
    const errorMsg = lastError?.message || String(lastError);
    console.error(`[SERVER AI] All attempt models failed. Final error:`, errorMsg);
    if (
      errorMsg.includes("quota") || 
      errorMsg.includes("429") || 
      errorMsg.includes("RESOURCE_EXHAUSTED") || 
      errorMsg.includes("limit")
    ) {
      return res.status(429).json({
        error: "تم تجاوز حصة استخدام نماذج ذكاء Gemini الاصطناعي (Quota Exceeded). يمكنك الذهاب إلى الإعدادات (Settings > Secrets) وتوفير مفتاح GEMINI_API_KEY صالح أو مدفوع لتفادي قيود الحصة اليومية للنسخة المجانية، أو يرجى الانتظار قليلاً والمحاولة مجدداً."
      });
    }

    res.status(500).json({ error: errorMsg });
  });

  // Proxy endpoint to fetch URL content (bypass CORS)
  app.post("/api/fetch-url", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    let lastError: any;
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': userAgents[attempt - 1] || userAgents[0],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Referer': attempt === 1 ? 'https://www.google.com/' : (attempt === 2 ? 'https://www.bing.com/' : 'https://www.google.com.sa/'),
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Connection': 'keep-alive'
          },
          timeout: 45000,
          maxRedirects: 15,
          validateStatus: (status) => status < 500
        });

        if (response.status === 403) {
          return res.status(403).json({ 
            error: "الموقع المقصود يحظر الطلبات المؤتمتة (Error 403). جرب نسخ المحتوى يدوياً واستخدامه في 'الإضافة المجمعة'." 
          });
        }

        const html = response.data;
        if (typeof html !== 'string') {
          return res.status(500).json({ error: "Received non-string data from source" });
        }

        const $ = cheerio.load(html);

        // Remove script and style tags
        $('script, style, nav, footer, header, noscript').remove();

        const text = $('body').text().replace(/\s+/g, ' ').trim();
        
        // Limit text size
        const cleanText = text.substring(0, 20000); 

        return res.json({ text: cleanText });
      } catch (error: any) {
        lastError = error;
        console.warn(`Fetch attempt ${attempt} failed for ${url}:`, error.message);
        // Wait bit before retry if it's a DNS or timeout error
        if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }

    console.error("Fetch URL Error after all attempts:", lastError.message);
    const isNetworkError = lastError.message.includes('getaddrinfo') || lastError.message.includes('ENOTFOUND') || lastError.message.includes('EAI_AGAIN') || lastError.message.includes('ECONNREFUSED');
    res.status(500).json({ 
      error: isNetworkError 
        ? `عذراً، تعذر الوصول إلى الموقع (${url}). قد يكون الموقع متوقفاً، أو يحظر الاتصال من مخدماتنا، أو هناك مشكلة في النطاق (DNS). يرجى استخدام "الإضافة المجمعة" لنسخ المحتوى يدوياً.` 
        : `فشل جلب المحتوى بعد 3 محاولات: ${lastError.message}` 
    });
  });

  // Vite middleware with production-to-development fallback
  const distPath = path.join(process.cwd(), 'dist');
  const hasBuild = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV !== "production" || !hasBuild) {
    if (process.env.NODE_ENV === "production" && !hasBuild) {
      console.warn("[BOOT] Production mode requested but 'dist/index.html' not found. Falling back to Vite development middleware.");
    }
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("[BOOT] Vite development middleware loaded successfully.");
    } catch (e) {
      console.error("[CRITICAL] Vite failed to load:", e);
    }
  } else {
    console.log("[BOOT] Serving pre-built static files from dist folder.");
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

startServer();
