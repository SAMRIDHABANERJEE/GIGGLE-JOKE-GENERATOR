import { GoogleGenAI, Type } from "@google/genai";
import { Joke, Vibe } from "./types.ts";

export const generateJoke = async (vibe: Vibe): Promise<Joke> => {
  const apiKey = (window as any).process?.env?.API_KEY || "";
  
  if (!apiKey) {
    throw new Error("API Key missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const personaMap: Record<string, string> = {
    [Vibe.CLEVER]: "a sharp-witted intellectual with a dry sense of humor",
    [Vibe.ABSURD]: "a surrealist philosopher who finds humor in the nonsensical",
    [Vibe.WHOLESOME]: "a warm, friendly neighbor who loves making people smile",
    [Vibe.WITTY]: "a fast-talking stand-up comedian known for quick one-liners",
    [Vibe.SURPRISE]: "a chaotic AI that blends multiple humor styles unpredictably"
  };

  const selectedVibe = vibe === Vibe.SURPRISE 
    ? [Vibe.CLEVER, Vibe.ABSURD, Vibe.WHOLESOME, Vibe.WITTY][Math.floor(Math.random() * 4)]
    : vibe;

  const systemInstruction = `
    You are ${personaMap[vibe]}.
    Your task is to generate a high-quality, 2-line joke.
    
    CRITICAL RULES:
    1. The joke MUST be exactly 2 parts (setup and punchline).
    2. Style: ${selectedVibe.toUpperCase()}.
    3. Tone: Creative, fresh, and high-impact. Avoid cliché puns.
    4. Safety: Uplifting and safe for everyone.
    5. Formatting: Return a valid JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Generate a ${selectedVibe} joke.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            setup: { type: Type.STRING },
            punchline: { type: Type.STRING }
          },
          required: ["setup", "punchline"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI.");
    
    return JSON.parse(text) as Joke;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("The humor link timed out. Recalibrating comedy circuits...");
  }
};