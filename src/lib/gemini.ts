// Helper to normalize schema types to uppercase for the SDK
export const normalizeSchema = (schema: any): any => {
  if (!schema || typeof schema !== 'object') return schema;
  
  const normalized = { ...schema };
  if (normalized.type && typeof normalized.type === 'string') {
    normalized.type = normalized.type.toUpperCase();
  }
  
  if (normalized.items) {
    normalized.items = normalizeSchema(normalized.items);
  }
  
  if (normalized.properties) {
    const props: any = {};
    for (const key in normalized.properties) {
      props[key] = normalizeSchema(normalized.properties[key]);
    }
    normalized.properties = props;
  }
  
  return normalized;
};

// Initialize Gemini proxy on the client side to bypass client-side crashes and secure the API keys
export const aiClient = {
  models: {
    async generateContent(options: {
      model: string;
      contents: string | any[];
      config?: {
        systemInstruction?: string;
        responseMimeType?: string;
        responseSchema?: any;
      }
    }) {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: options.model,
          prompt: options.contents,
          systemInstruction: options.config?.systemInstruction,
          responseMimeType: options.config?.responseMimeType,
          responseSchema: options.config?.responseSchema
        })
      });

      if (!response.ok) {
        let errorMsg = "AI request failed";
        try {
          const errData = await response.json();
          errorMsg = errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return { text: data.text };
    }
  }
};
