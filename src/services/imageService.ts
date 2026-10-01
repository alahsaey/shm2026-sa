import { aiClient } from "../lib/gemini";

const FAMOUS_KNOWN_LOGOS: { [key: string]: string } = {
  "bluetooth": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bluetooth.svg/1024px-Bluetooth.svg.png",
  "بلوتوث": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bluetooth.svg/1024px-Bluetooth.svg.png",
  "nfc": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/NFC_logo.svg/1024px-NFC_logo.svg.png",
  "اتصال قريب المدى": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/NFC_logo.svg/1024px-NFC_logo.svg.png",
  "chatgpt": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
  "أرامكو": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png",
  "aramco": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png",
  "الهلال": "https://upload.wikimedia.org/wikipedia/ar/thumb/0/05/Logo_al-hilal.svg/1200px-Logo_al-hilal.svg.png",
  "al-hilal": "https://upload.wikimedia.org/wikipedia/ar/thumb/0/05/Logo_al-hilal.svg/1200px-Logo_al-hilal.svg.png",
  "al hilal": "https://upload.wikimedia.org/wikipedia/ar/thumb/0/05/Logo_al-hilal.svg/1200px-Logo_al-hilal.svg.png",
  "النصر": "https://upload.wikimedia.org/wikipedia/ar/thumb/1/1e/Logo_Al-Nassr.svg/1024px-Logo_Al-Nassr.svg.png",
  "al-nassr": "https://upload.wikimedia.org/wikipedia/ar/thumb/1/1e/Logo_Al-Nassr.svg/1024px-Logo_Al-Nassr.svg.png",
  "الاتحاد": "https://upload.wikimedia.org/wikipedia/ar/thumb/e/e3/Al_Ittihad_Saudi_Club_logo.svg/1024px-Al_Ittihad_Saudi_Club_logo.svg.png",
  "al-ittihad": "https://upload.wikimedia.org/wikipedia/ar/thumb/e/e3/Al_Ittihad_Saudi_Club_logo.svg/1024px-Al_Ittihad_Saudi_Club_logo.svg.png",
  "الأهلي": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Al_Ahly_SC_logo.svg/1024px-Al_Ahly_SC_logo.svg.png",
  "al-ahly": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Al_Ahly_SC_logo.svg/1024px-Al_Ahly_SC_logo.svg.png",
  "ريال مدريد": "https://upload.wikimedia.org/wikipedia/ar/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png",
  "real madrid": "https://upload.wikimedia.org/wikipedia/ar/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png",
  "برشلونة": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28logo%29.svg/1024px-FC_Barcelona_%28logo%29.svg.png",
  "barcelona": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28logo%29.svg/1024px-FC_Barcelona_%28logo%29.svg.png",
  "آبل": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png",
  "apple": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png",
  "جوجل": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
  "google": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
  "مايكروسوفت": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1024px-Microsoft_logo_%282012%29.svg.png",
  "microsoft": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1024px-Microsoft_logo_%282012%29.svg.png",
  "نايكي": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
  "nike": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
  "mercedes": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1024px-Mercedes-Benz_Logo_2010.svg.png",
  "مرسيدس": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1024px-Mercedes-Benz_Logo_2010.svg.png",
  "twitter": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/X_logo_2023.svg/1024px-X_logo_2023.svg.png",
  "x platform": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/X_logo_2023.svg/1024px-X_logo_2023.svg.png",
  "تويتر": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/X_logo_2023.svg/1024px-X_logo_2023.svg.png",
  "mcdonald": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
  "ماكدونالدز": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
  "samsung": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1000px-Samsung_Logo.svg.png",
  "سامسونج": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1000px-Samsung_Logo.svg.png",
  "adidas": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png",
  "أديداس": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png",
  "puma": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/1024px-Puma_Logo.svg.png",
  "بوما": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_Logo.svg/1024px-Puma_Logo.svg.png",
  "ferrari": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/1024px-Ferrari-Logo.svg.png",
  "فيراري": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/1024px-Ferrari-Logo.svg.png",
  "toyota": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota_logo_and_wordmark.svg/1200px-Toyota_logo_and_wordmark.svg.png",
  "تويوتا": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota_logo_and_wordmark.svg/1200px-Toyota_logo_and_wordmark.svg.png",
  "android": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Android_robot_head_2019.svg/1200px-Android_robot_head_2019.svg.png",
  "اندرويد": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Android_robot_head_2019.svg/1200px-Android_robot_head_2019.svg.png",
  "tesla": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png",
  "تيسلا": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png",
  "whatsapp": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png",
  "واتساب": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png",
  "واتس اب": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png",
  "telegram": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1024px-Telegram_logo.svg.png",
  "تلغرام": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1024px-Telegram_logo.svg.png",
  "تيليجرام": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1024px-Telegram_logo.svg.png",
  "facebook": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png",
  "فيسبوك": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png",
  "instagram": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png",
  "انستغرام": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png",
  "إنستغرام": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png",
  "youtube": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/1024px-YouTube_Logo_2017.svg.png",
  "يوتيوب": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/1024px-YouTube_Logo_2017.svg.png",
  "amazon": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
  "أمازون": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
  "bmw": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1024px-BMW.svg.png",
  "بي ام دبليو": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1024px-BMW.svg.png",
  "audi": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Audi_Rings_Logo_%282016%29.svg/1024px-Audi_Rings_Logo_%282016%29.svg.png",
  "أودي": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Audi_Rings_Logo_%282016%29.svg/1024px-Audi_Rings_Logo_%282016%29.svg.png",
  "intel": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Intel_logo_2020.svg/1024px-Intel_logo_2020.svg.png",
  "إنتل": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Intel_logo_2020.svg/1024px-Intel_logo_2020.svg.png",
  "sony": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Sony_logo.svg/1024px-Sony_logo.svg.png",
  "سوني": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Sony_logo.svg/1024px-Sony_logo.svg.png",
  "playstation": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/1024px-PlayStation_logo.svg.png",
  "بلايستيشن": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/1024px-PlayStation_logo.svg.png",
  "visa": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_2021.svg/1024px-Visa_2021.svg.png",
  "فيزا": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_2021.svg/1024px-Visa_2021.svg.png",
  "mastercard": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1024px-Mastercard-logo.svg.png",
  "ماستركارد": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1024px-Mastercard-logo.svg.png",
  "paypal": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1024px-PayPal.svg.png",
  "بايبال": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1024px-PayPal.svg.png",
  "disney": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Walt_Disney_Pictures_logo.svg/1024px-Walt_Disney_Pictures_logo.svg.png",
  "ديزني": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Walt_Disney_Pictures_logo.svg/1024px-Walt_Disney_Pictures_logo.svg.png",
  "pepsi": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/1024px-Pepsi_logo_2014.svg.png",
  "بيبسي": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/1024px-Pepsi_logo_2014.svg.png",
  "cocacola": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Coca-Cola_bottle_cap_logo.svg/1024px-Coca-Cola_bottle_cap_logo.svg.png",
  "كوكاكولا": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Coca-Cola_bottle_cap_logo.svg/1024px-Coca-Cola_bottle_cap_logo.svg.png",
  "stc": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png",
  "إس تي سي": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png",
  "اس تي سي": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png",
  "مجموعة إس تي سي": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STC-01.svg/1024px-STC-01.svg.png"
};

function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[-_()'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

class ImageService {
  constructor() {}

  async fetchSmartImage(questionText: string, answerText?: string): Promise<string | null> {
    try {
      const qNorm = normalizeText(questionText);
      const aNorm = normalizeText(answerText || "");

      // Look through our static mappings for exact normalized matching (longest keys first)
      const sortedKeys = Object.keys(FAMOUS_KNOWN_LOGOS).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        const keyNorm = normalizeText(key);
        if (keyNorm && (qNorm.includes(keyNorm) || aNorm.includes(keyNorm))) {
          console.log(`[NORM MATCH] Matched key: "${key}" (normalized: "${keyNorm}") to URL: ${FAMOUS_KNOWN_LOGOS[key]}`);
          return FAMOUS_KNOWN_LOGOS[key];
        }
      }

      // Check if this appears to be a logo/brand question
      const isLogoRelated = 
        qNorm.includes("شعار") || 
        qNorm.includes("شعارات") || 
        qNorm.includes("لوجو") || 
        qNorm.includes("لوقو") || 
        qNorm.includes("شكل هندسي") ||
        qNorm.includes("ماركه") ||
        qNorm.includes("ماركة") ||
        qNorm.includes("logo");

      if (isLogoRelated && answerText) {
        // Try parenthesis extraction (e.g. "نايكي (Nike)")
        const parenMatch = answerText.match(/\(([a-zA-Z0-9\s.-]+)\)/);
        if (parenMatch) {
          const extracted = parenMatch[1].trim().toLowerCase();
          if (extracted.length >= 2 && isNaN(Number(extracted))) {
            const cleanDomain = `${extracted.replace(/\s+/g, "")}.com`;
            console.log(`[REG EXTRACT EN PAREN] Extracted English domain: "${cleanDomain}" for logo`);
            return `https://logo.clearbit.com/${cleanDomain}`;
          }
        }

        // Try direct English word extraction (e.g. "شركة Google")
        const engMatch = answerText.match(/[a-zA-Z][a-zA-Z0-9.-]{2,}/g);
        if (engMatch) {
          const extracted = engMatch[0].trim().toLowerCase();
          if (extracted.length >= 2) {
            const cleanDomain = `${extracted.replace(/\s+/g, "")}.com`;
            console.log(`[REG EXTRACT EN WORD] Extracted English domain: "${cleanDomain}" for logo`);
            return `https://logo.clearbit.com/${cleanDomain}`;
          }
        }

        try {
          // Ask Gemini to extract a clean domain name for the brand
          const extractPrompt = `
            Identify the brand, company, sports club, or technology name from this trivia question or answer.
            Question: "${questionText}"
            Answer: "${answerText}"
            
            Return ONLY the web domain of that company/brand (e.g. "bluetooth.com", "nike.com", "apple.com", "audi.com", "realmadrid.com", "aramco.com").
            If it is not a commercial brand/logo, reply ONLY with "none".
            Do not include any extra words, quotes, markdown, or braces. Just the domain name.
          `;
          
          const domainResponse = await aiClient.models.generateContent({
            model: "gemini-3.5-flash",
            contents: extractPrompt
          });

          const extractedDomain = domainResponse.text?.trim().toLowerCase();
          if (extractedDomain && extractedDomain !== "none" && extractedDomain.includes(".") && !extractedDomain.includes(" ")) {
            console.log(`Extracted brand domain: "${extractedDomain}" for answer: "${answerText}"`);
            // We use Clearbit API as a highly authentic proxy for company logos
            return `https://logo.clearbit.com/${extractedDomain}`;
          }
        } catch (e) {
          console.warn("Failed to extract brand domain using AI, proceeding with fallback prompt:", e);
        }
      }

      const prompt = `
        You are a highly accurate image prompt engineer for a premium trivia application.
        
        TASK:
        Generate a highly descriptive, professional English prompt for an AI image generator.
        The image MUST be a perfect, literally accurate visual representation of the specific subject mentioned in the trivia question below.
        
        STYLING REQUIREMENTS:
        - Style: Realistic, cinematic photography or high-fidelity 3D rendering.
        - Focus: Sharp focus on the main subject.
        - Accuracy: If it's a historical figure, location, or specific object, ensure the details match the known reality of that subject.
        - Avoid: Generic concepts. Be specific. If the question asks about "Fatima's beads", show a beautiful 100-bead tasbih. If it's "Apple logo", show it cleanly.
        - No text: The image should contain NO text, letters, or numbers.
		
        QUESTION CONTEXT (translated for you): "${questionText}"
        CORE SUBJECT/ANSWER (the most important part to show): "${answerText || 'Not provided'}"
        
        OUTPUT:
        Return ONLY the descriptive English prompt. No markdown, no quotes, no explanations.
      `;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      const description = response.text?.trim();
      
      if (description) {
        // Use a generative image service with the prompt
        const encodedPrompt = encodeURIComponent(description);
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
      }
      
      return null;
    } catch (error) {
      console.error("Failed to fetch smart image:", error);
      return null;
    }
  }
}

export const imageService = new ImageService();
