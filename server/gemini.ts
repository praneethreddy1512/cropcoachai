// Gemini AI integration for KrishiAI - based on javascript_gemini blueprint
import { GoogleGenAI } from "@google/genai";

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Generate agricultural news for a specific state and language
export async function generateNews(state: string, language: string, category: string) {
  const prompt = `Generate a realistic agricultural news article for ${state} state in India. 
Language: ${language}
Category: ${category}
Include: title, summary (2-3 lines), full content (5-6 paragraphs), and make it relevant to farmers in ${state}.
Return as JSON with fields: title, summary, content`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
    },
    contents: prompt,
  });

  return JSON.parse(response.text || "{}");
}

// Detect plant disease from image
export async function detectDisease(imageBase64: string) {
  const contents = [
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    },
    `You are an agricultural expert. Analyze this crop/plant image and identify any diseases.
Return JSON with: diseaseName (string), confidence (percentage as string like "85%"), treatment (detailed treatment steps as string).
If no disease, return: {"diseaseName": "Healthy", "confidence": "95%", "treatment": "No treatment needed. Continue regular care."}`,
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
    },
    contents: contents,
  });

  return JSON.parse(response.text || "{}");
}

// Get crop recommendations
export async function getCropRecommendations(data: {
  soilType: string;
  climate: string;
  budget: string;
  state: string;
}) {
  const prompt = `You are an agricultural expert. Based on these conditions:
- Soil Type: ${data.soilType}
- Climate: ${data.climate}
- Budget: ₹${data.budget}
- State: ${data.state}

Recommend 3 suitable crops with reasoning. Return JSON with:
{
  "crops": [{"name": string, "profit": "High/Medium/Low", "season": string, "suitability": number (0-100)}],
  "reasoning": string (2-3 sentences about budget analysis)
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
    },
    contents: prompt,
  });

  return JSON.parse(response.text || "{}");
}

// AI Chat response
export async function getChatResponse(message: string, language: string) {
  const languageInstruction = language === 'en' ? 'English' :
                               language === 'hi' ? 'Hindi' :
                               language === 'te' ? 'Telugu' :
                               language === 'ta' ? 'Tamil' :
                               language === 'kn' ? 'Kannada' : 'English';

  const prompt = `You are KrishiAI, a helpful agricultural assistant for Indian farmers. 
User's question in ${languageInstruction}: ${message}

Respond in ${languageInstruction} language with helpful, practical advice about farming, crops, weather, schemes, or agricultural techniques.
Keep responses concise (3-4 sentences) and farmer-friendly.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "I'm here to help with farming questions!";
}

// Generate government schemes information
export async function getGovernmentSchemes(state: string, language: string) {
  const languageInstruction = language === 'en' ? 'English' :
                               language === 'hi' ? 'Hindi' :
                               language === 'te' ? 'Telugu' :
                               language === 'ta' ? 'Tamil' :
                               language === 'kn' ? 'Kannada' : 'English';

  const prompt = `Generate 4 realistic government agricultural schemes for ${state} state, India.
Language: ${languageInstruction}

Return JSON array with each scheme having:
{
  "schemeName": string,
  "category": "subsidy" | "loan" | "insurance" | "training",
  "description": string (1-2 lines),
  "eligibility": string,
  "benefits": string,
  "howToApply": string
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
    },
    contents: prompt,
  });

  return JSON.parse(response.text || "[]");
}

// Generate dashboard analytics data
export async function getDashboardData(state: string, district: string) {
  const prompt = `Generate realistic agricultural dashboard data for ${district}, ${state}.
Return JSON with:
{
  "cropHealth": number (0-100),
  "soilMoisture": number (0-100),
  "temperature": number (15-40),
  "marketPrice": number (1000-5000),
  "weatherCondition": string,
  "cropHealthTrend": [{"month": string, "health": number}] (last 6 months),
  "marketPrices": [{"crop": string, "price": number}] (5 crops common in the region)
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
    },
    contents: prompt,
  });

  return JSON.parse(response.text || "{}");
}
