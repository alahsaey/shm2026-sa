import { dataService } from "../lib/dataService";
import { aiClient, normalizeSchema } from "../lib/gemini";

export interface ExtractedQuestion {
  text: string;
  answer: string;
  points: number;
  source: string;
  imageUrl?: string;
  videoUrl?: string;
  imagePrompt?: string;
}

// Re-map the response structure from Gemini 3
export function safeJsonParse(text: string): any {
  if (!text) return null;
  let cleanText = text.trim();
  
  // Remove markdown code block wrappers
  cleanText = cleanText.replace(/^```json\s*/i, "");
  cleanText = cleanText.replace(/^```javascript\s*/i, "");
  cleanText = cleanText.replace(/^```\s*/i, "");
  cleanText = cleanText.replace(/```$/, "");
  cleanText = cleanText.trim();
  
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    // Try to extract JSON array or object using regex
    try {
      const matchArray = cleanText.match(/\[[\s\S]*\]/);
      if (matchArray) {
        return JSON.parse(matchArray[0]);
      }
      const matchObject = cleanText.match(/\{[\s\S]*\}/);
      if (matchObject) {
        return JSON.parse(matchObject[0]);
      }
    } catch (innerError) {
      console.error("Failed to parse JSON even with regex extraction:", innerError);
    }
    throw e;
  }
}

async function callAi(options: { 
  prompt: string; 
  systemInstruction?: string; 
  responseMimeType?: string; 
  responseSchema?: any;
}) {
  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: options.prompt,
      config: {
        systemInstruction: options.systemInstruction,
        responseMimeType: options.responseMimeType || (options.responseSchema ? "application/json" : "text/plain"),
        responseSchema: options.responseSchema ? normalizeSchema(options.responseSchema) : undefined
      }
    });

    return { text: response.text };
  } catch (error: any) {
    console.error("AI Client Error:", error);
    const errorMsg = error.message || String(error);
    
    if (errorMsg.includes("API key not valid") || errorMsg.includes("API_KEY_INVALID") || errorMsg.includes("Missing GEMINI_API_KEY")) {
      throw new Error("مفتاح API الخاص بـ Gemini غير صالح أو مفقود. يرجى التأكد من إعداد مفتاح صالح في قائمة (Settings > Secrets) باسم GEMINI_API_KEY. يمكنك الحصول على مفتاح مجاني من: https://aistudio.google.com/app/apikey");
    }
    
    if (errorMsg.includes("quota") || errorMsg.includes("429") || errorMsg.includes("limit")) {
      throw new Error("تم تجاوز حصة استخدام Gemini. يرجى الانتظار قليلاً أو تقليل وتيرة الطلبات.");
    }

    throw new Error(errorMsg);
  }
}

export const aiService = {
  async extractQuestionsFromUrlContent(content: string, url: string, existingQuestions: string[] = []): Promise<ExtractedQuestion[]> {
    const prompt = `
      Please extract a massive and highly diverse set of trivia or educational questions and answers from the following text content.
      The text content was fetched from: ${url}

      CRITICAL REQUIREMENTS:
      1. QUANTITY: Extract a focused set of trivia or educational questions, aiming for around 15-20 high-quality unique questions.
      2. DIVERSITY: Ensure a balance across these specific point levels ONLY: [20, 40, 60].
         - 20: Basic, direct facts (Easy).
         - 40: Requires some thought or less obvious details (Medium).
         - 60: Deep details, relationships, or complex facts (Hard).
      3. IMAGES & VIDEOS:
         - If the content contains links to relevant images or illustrations, include the absolute URL in the 'imageUrl' field.
         - If the content refers to a YouTube video or specific timestamp in a video provided as source, include the YouTube URL in 'videoUrl'.
         - If no relevant image/video is found, leave them empty or null.
      4. IMAGE PROMPT (CRITICAL): If 'imageUrl' is not found in the text, you MUST generate a professional, literally accurate English description of the question's subject for an AI image generator in the 'imagePrompt' field (No text in images).
      5. MULTIPLICITY: We need MANY questions for EACH level so the game can be replayed or have many options.
      6. VARIETY: Don't just ask about names. Ask about dates, locations, "why" questions, "how" questions, and "what if" scenarios derived from the text.
      7. FORMAT: Use clear, natural Arabic suitable for a competitive quiz.
      8. SOURCE: Use the original URL ${url} as the source for all questions.
      9. DUPLICATE PREVENTION: You MUST NOT repeat any of the following existing questions. Seriously, if you find any of these in your output, discard and replace them:
      ${existingQuestions.slice(-100).join(' | ')}

      Input content to analyze:
      ${content}
    `;

    try {
      const response = await callAi({
        prompt: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              answer: { type: "string" },
              points: { type: "number" },
              source: { type: "string" },
              imageUrl: { type: "string" },
              videoUrl: { type: "string" },
              imagePrompt: { type: "string" }
            },
            required: ["text", "answer", "points", "source"]
          }
        }
      });

      const extracted = safeJsonParse(response.text || "[]");
      const processed = Array.isArray(extracted) ? extracted : [];

      // Process images
      for (const q of processed) {
        if (!q.imageUrl && (q as any).imagePrompt) {
          const encodedPrompt = encodeURIComponent((q as any).imagePrompt);
          q.imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
        }
      }

      return processed;
    } catch (error: any) {
      console.error("AI Extraction Error:", error);
      throw error;
    }
  },

  async generateQuestionsFromTopic(topic: string, count: number = 20, existingQuestions: string[] = [], sourceText: string = '', letter?: string): Promise<ExtractedQuestion[]> {
    const existingContext = existingQuestions.length > 0 
      ? `\nتنبيه هام جداً: لا تقم بتكرار أياً من هذه الأسئلة الموجودة مسبقاً (تجنبها تماماً):\n- ${existingQuestions.slice(-120).join(' | ')}`
      : '';

    const sourceContext = sourceText 
      ? `\nالمعلومات والمصادر المحددة (يجب الاعتماد عليها أولاً):\n${sourceText}`
      : '';

    const letterContext = letter 
      ? (letter === 'الكل' 
          ? `\nشرط إضافي هام جداً: هذا تحدي "جميع الحروف". يرجى تنويع الأسئلة بحيث تغطي حروفاً مختلفة من الأبجدية العربية، ويجب أن تبدأ كل إجابة بحرف محدد، وقم بتضمين الحرف في بداية نص الإجابة بين قوسين مثل: (ب) بطيخ.`
          : `\nشرط إضافي هام جداً: يجب أن تبدأ كل "إجابة" من الإجابات بالحرف "${letter}".`)
      : '';

    const prompt = `
      يرجى إنشاء مجموعة احترافية وشاملة من الأسئلة والأجوبة حول الموضوع التالي: "${topic}".
      ${sourceContext}
      ${existingContext}
      ${letterContext}
      
      المتطلبات الدقيقة:
      1. العدد: قم بإنشاء ${count} سؤالاً فريداً تماماً وغير متكرر.
      2. التنوع والصعوبة: وزع الأسئلة على هذه المستويات الثلاثة: [20, 40, 60]
      3. المصدر والفيديو:
         - قم بتحديد المصدر الحقيقي والدقيق للمعلومة.
         - إذا كان الموضوع يحتوي على رابط فيديو يوتيوب في المصادر المرفقة، حاول استخراج أسئلة منه ووضع رابط الفيديو في حقل 'videoUrl'.
      4. وصف الصورة (هام): قم بتوليد وصف دقيق باللغة الإنجليزية في حقل 'imagePrompt' لكل سؤال (وصف لمحتوى الصورة فقط بدون نص) لإنشاء صورة تعبيرية دقيقة للسؤال.
      
      المخرجات يجب أن تكون بصيغة JSON حصراً وهي عبارة عن مصفوفة من الكائنات.
    `;

    try {
      const response = await callAi({
        prompt: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              answer: { type: "string" },
              points: { type: "number" },
              source: { type: "string" },
              imageUrl: { type: "string" },
              videoUrl: { type: "string" },
              imagePrompt: { type: "string" }
            },
            required: ["text", "answer", "points", "source"]
          }
        }
      });

      const generated = safeJsonParse(response.text || "[]");
      const processed = Array.isArray(generated) ? generated : [];

      for (const q of processed) {
        if (!q.imageUrl && (q as any).imagePrompt) {
          const encodedPrompt = encodeURIComponent((q as any).imagePrompt);
          q.imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
        }
      }

      return processed;
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      throw error;
    }
  },

  async rephraseText(text: string, type: 'question' | 'answer'): Promise<string> {
    const prompt = type === 'question' 
      ? `قم بإعادة صياغة هذا السؤال بأسلوب مختلف وجذاب كمسابقة ثقافية، مع الحفاظ على نفس المعنى تماماً: "${text}". أجب بالنص الجديد فقط بدون مقدمات.`
      : `قم بإعطاء صياغة أفضل أو أكثر دقة لهذه الإجابة: "${text}". أجب بالنص الجديد فقط بدون مقدمات.`;

    try {
      const response = await callAi({ prompt });
      return response.text?.trim() || text;
    } catch (error: any) {
      console.error("AI Rephrase Error:", error);
      return text;
    }
  },

  async parseBulkQuestions(rawText: string): Promise<ExtractedQuestion[]> {
    const prompt = `
      Please parse the following raw text and extract structured trivia/educational questions and answers.
      The text might be in various formats (e.g., Question: Answer, Q&A, or just a list).
      
      REQUIREMENTS:
      1. FORMAT: Output MUST be a JSON array of objects.
      2. POINTS: Assign logical points for each question (20 for easy, 40 for medium, 60 for hard).
      3. ARABIC: Maintain the original Arabic text for questions and answers.
      4. CLEANING: Remove any numbering or prefixes (like "السؤال الأول:" or "1.") from the questions.
      5. IMAGE/VIDEO: If you see something that looks like an image URL or YouTube link, put it in 'imageUrl' or 'videoUrl'.
      6. IMAGE PROMPT: Generate a professional English description for an AI image in 'imagePrompt' for each question.
      
      RAW TEXT:
      ${rawText}
    `;

    try {
      const response = await callAi({
        prompt: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              answer: { type: "string" },
              points: { type: "number" },
              source: { type: "string" },
              imageUrl: { type: "string" },
              videoUrl: { type: "string" },
              imagePrompt: { type: "string" }
            },
            required: ["text", "answer", "points"]
          }
        }
      });

      const parsed = safeJsonParse(response.text || "[]");
      const processed = Array.isArray(parsed) ? parsed : [];
      
      for (const q of processed) {
        if (!q.imageUrl && (q as any).imagePrompt) {
          const encodedPrompt = encodeURIComponent((q as any).imagePrompt);
          q.imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
        }
      }
      
      return processed;
    } catch (error: any) {
      console.error("AI Bulk Parse Error:", error);
      throw error;
    }
  },

  async fetchUrlContent(url: string): Promise<string> {
    try {
      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const contentType = response.headers.get("content-type");
      const text = await response.text();

      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response from fetch-url:", text.substring(0, 500));
        
        if (text.includes("403 Forbidden") || response.status === 403) {
          throw new Error("الموقع أو خدمة الحماية تحظر هذا الطلب (403 Forbidden). هذا الموقع قد يتطلب الدخول اليدوي ونسخ المحتوى ولصقه في 'الإضافة المجمعة'.");
        }
        if (text.includes("429 Too Many Requests") || response.status === 429) {
          throw new Error("تم إرسال عدد كبير من الطلبات للموقع. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.");
        }
        if (text.includes("Cloudflare") || text.includes("security") || text.includes("challenge-running")) {
          throw new Error("الموقع محمي بخدمة Cloudflare أو وسيلة حماية تمنع الدخول الآلي. يرجى نسخ المحتوى يدوياً.");
        }
        
        throw new Error("المصدر لا يستجيب ببيانات صحيحة (استجابة غير متوقعة). يرجى التأكد من صحة الرابط أو تجربة موقع آخر.");
      }

      if (!response.ok) {
        let errorMsg = "Failed to fetch URL content";
        try {
          const error = safeJsonParse(text);
          errorMsg = error.error || errorMsg;
        } catch {
          errorMsg = text.substring(0, 100);
        }
        throw new Error(errorMsg);
      }

      const data = safeJsonParse(text);
      return data.text;
    } catch (error: any) {
      console.error("fetchUrlContent total failure:", error);
      const msg = error.message || '';
      if (msg.includes('getaddrinfo') || msg.includes('ENOTFOUND') || msg.includes('EAI_AGAIN')) {
        throw new Error(`فشل في العثور على الموقع (${url}). تأكد من صحة الرابط أو المخدم الخاص بالموقع.`);
      }
      throw error;
    }
  },

  async syncCategory(catId: string, url: string, currentQuestions: any[]) {
    try {
      const existingTexts = currentQuestions.map(q => q.text.trim());
      const content = await this.fetchUrlContent(url);
      const newQuestions = await this.extractQuestionsFromUrlContent(content, url, existingTexts);
      
      const added = [];
      for (const q of newQuestions) {
        // Double check for duplicates locally
        const isDup = existingTexts.some(txt => txt === q.text.trim());
        if (!isDup) {
          const ref = await dataService.addQuestion(catId, {
            ...q,
            videoEnabled: !!q.videoUrl,
            imagesEnabled: !!q.imageUrl
          });
          added.push({ 
            id: ref.id, 
            categoryId: catId, 
            ...q, 
            videoEnabled: !!q.videoUrl,
            imagesEnabled: !!q.imageUrl,
            isAnswered: false, 
            createdAt: new Date() 
          });
          // Update local list to avoid duplicates within the same batch if AI fails
          existingTexts.push(q.text.trim());
        }
      }
      return added;
    } catch (error) {
      console.error("Auto Sync Error:", error);
      return [];
    }
  },

  async generateOptions(question: string, answer: string, otherAnswers?: string[]): Promise<string[]> {
    const prompt = `
      You are a quiz assistant. For the following question and its correct answer, please generate 2 additional plausible but incorrect answers (distractors) in Arabic.
      
      Question: "${question}"
      Correct Answer: "${answer}"
      
      Return a JSON array of 3 strings: the correct answer and the 2 distractors. Shuffle the array so the correct answer is at a random position.
      
      Output ONLY the JSON array.
    `;

    try {
      const response = await callAi({
        prompt: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: { type: "string" },
          minItems: 3,
          maxItems: 3
        }
      });

      const options = safeJsonParse(response.text || "[]");
      return validateAndFixOptions(options, answer, otherAnswers);
    } catch (error: any) {
      console.error("AI Options Generation Error:", error);
      return validateAndFixOptions([], answer, otherAnswers);
    }
  },

  async generateHint(question: string, answer: string): Promise<string> {
    const prompt = `
      أنت مساعد خبير في مسابقة ثقافية عربية ترفيهية تقوم بتوليد تلميحات ذكية ومحفزة للتفكير لمساعدة المتسابقين.
      السؤال المطروح: "${question}"
      الإجابة النموذجية: "${answer}"
      
      المطلوب دقة تامة في تطبيق الشروط التالية:
      1. لغة عربية سليمة وواضحة جداً.
      2. التلميح يجب أن يقود المتسابق ذهنياً للإجابة بطريقة ذكية وغير مباشرة.
      3. يمنع تماماً وبتاتاً ذكر كلمة الإجابة النموذجية نفسها أو أي مرادف مباشر جداً أو واضح يسرب الحل للمتسابق.
      4. يجب أن يكون التلميح قصيراً وموجزاً ومثيراً للتشويق (سطر واحد فقط، لا يتجاوز 15 كلمة).
      5. لا تكتب أي مقدمات أو شروحات إضافية مثل "التلميح هو:" أو مرئيات مثل علامات الاقتباس حول التلميح كاملاً. اكتب التلميح مباشرة.
    `;

    try {
      const response = await callAi({
        prompt: prompt
      });

      return response.text?.trim() || "فكر في كلمات السؤال بعناية للوصول للحل البديع.";
    } catch (error: any) {
      console.error("AI Hint Generation Error:", error);
      return "يرجى التفكير بعمق للوصول للإجابة الصحيحة.";
    }
  },

  async regenerateCategoryQuestions(catId: string, name: string, sourceText: string = '', letter?: string) {
    try {
      // 1. Fetch current questions
      const existingQs = await dataService.getQuestions(catId);
      const existingTexts = existingQs.map(q => q.text.trim());
      
      // 2. Generate 10 new questions avoiding existingTexts
      const newQuestions = await this.generateQuestionsFromTopic(
        name, 
        10, 
        existingTexts, 
        sourceText, 
        letter
      );
      
      // 3. Delete existing questions in the database
      for (const q of existingQs) {
        await dataService.deleteQuestion(catId, q.id);
      }
      
      // 4. Save new questions
      const added = [];
      for (const q of newQuestions) {
        const ref = await dataService.addQuestion(catId, {
          ...q,
          videoEnabled: !!q.videoUrl,
          imagesEnabled: !!q.imageUrl
        });
        added.push({
          id: ref.id,
          categoryId: catId,
          ...q,
          videoEnabled: !!q.videoUrl,
          imagesEnabled: !!q.imageUrl,
          isAnswered: false,
          createdAt: new Date()
        });
      }
      return added;
    } catch (error) {
      console.error(`Error regenerating questions for category ${name}:`, error);
      throw error;
    }
  }
};

/**
 * Validates, filters duplicates, ensures correct answer inclusion, and formats options to exactly 3 choices.
 */
export function validateAndFixOptions(
  options: any,
  answer: string,
  otherAnswers: string[] = []
): string[] {
  const cleanAnswer = (answer || "").trim();
  if (!cleanAnswer) {
    return ["خيار 1", "خيار 2", "خيار 3"];
  }

  // Unified Arabic Normalization hash to catch identical-looking choices
  const normalizeSimple = (str: string): string => {
    return (str || "")
      .trim()
      .toLowerCase()
      .replace(/[\u064B-\u065F]/g, "") // remove Arabic diacritics
      .replace(/[أإآا]/g, "ا")       // unify Alefs
      .replace(/ة/g, "ه")            // unify Tehmut / Teh Marbuta
      .replace(/ى/g, "ي")            // unify Alef Maksura
      .replace(/\s+/g, "");          // strip spaces
  };

  const answerHash = normalizeSimple(cleanAnswer);
  const seenHashes = new Set<string>();
  let list: string[] = [];

  // Parse and deduplicate provided options
  if (Array.isArray(options)) {
    for (const o of options) {
      const cleanO = String(o).trim();
      if (!cleanO || cleanO.includes("خيار")) continue;
      const hash = normalizeSimple(cleanO);
      if (!seenHashes.has(hash)) {
        seenHashes.add(hash);
        list.push(cleanO);
      }
    }
  }

  // Check if answer is present
  const containsAnswer = seenHashes.has(answerHash);

  if (!containsAnswer) {
    if (list.length < 3) {
      list.push(cleanAnswer);
      seenHashes.add(answerHash);
    } else {
      // Replace a random element with the correct answer
      const replaceIdx = Math.floor(Math.random() * list.length);
      const oldVal = list[replaceIdx];
      seenHashes.delete(normalizeSimple(oldVal));
      list[replaceIdx] = cleanAnswer;
      seenHashes.add(answerHash);
    }
  }

  // Gather other candidate answers from category
  const candidates = Array.from(new Set(
    otherAnswers
      .map(a => (a || "").trim())
      .filter(a => a && !a.includes("خيار"))
  ));

  // Distractors
  const generalDistractors = [
    "الهلال", "النصر", "الاتحاد", "الأهلي", "ريال مدريد", "برشلونة", "بايرن ميونخ", "ليفربول", "مانشستر سيتي", 
    "مكة المكرمة", "الرياض", "جدة", "المدينة المنورة", "القاهرة", "دبي", "المنامة", "الكويت", "مسقط", "عمان", 
    "أبوظبي", "المملكة العربية السعودية", "جمهورية مصر العربية", "دولة الإمارات العربية المتحدة", "مملكة البحرين", 
    "عام 2022", "عام 1999", "عام 2018", "عام 2015", "عام 2010", "عام 1990",
    "كريستيانو رونالدو", "ليونيل ميسي", "محمد صلاح", "كريم بنزيما", "نيمار دا سيلفا", "كيليان مبابي",
    "كأس العالم", "دوري أبطال أوروبا", "الدوري السعودي للمحترفين", "كأس خادم الحرمين الشريفين",
    "تويتر (X)", "سناب شات", "إنستغرام", "جوجل", "آبل", "مايكروسوفت", "سامسونج"
  ];

  // Fill up with candidate answers from category
  const shuffledCandidates = [...candidates].sort(() => 0.5 - Math.random());
  for (const cand of shuffledCandidates) {
    if (list.length >= 3) break;
    const candHash = normalizeSimple(cand);
    if (!seenHashes.has(candHash) && candHash !== answerHash) {
      seenHashes.add(candHash);
      list.push(cand);
    }
  }

  // Fill up with general distractors
  const shuffledGeneral = [...generalDistractors].sort(() => 0.5 - Math.random());
  for (const dist of shuffledGeneral) {
    if (list.length >= 3) break;
    const distHash = normalizeSimple(dist);
    if (!seenHashes.has(distHash) && distHash !== answerHash) {
      seenHashes.add(distHash);
      list.push(dist);
    }
  }

  // Slice to exactly 3
  list = list.slice(0, 3);

  // If still less than 3, add generic safe ones
  let count = 1;
  while (list.length < 3) {
    const backupStr = `خيار بديل ${count++}`;
    const backupHash = normalizeSimple(backupStr);
    if (!seenHashes.has(backupHash)) {
      seenHashes.add(backupHash);
      list.push(backupStr);
    }
  }

  // Shuffle order randomly so the correct answer behaves dynamically
  return list.sort(() => 0.5 - Math.random());
}
