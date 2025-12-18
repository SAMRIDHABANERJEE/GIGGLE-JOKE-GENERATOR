import { GoogleGenAI, Type } from "@google/genai";
import { Joke, Vibe } from "./types.ts";

export const generateJoke = async (vibe: Vibe): Promise<Joke> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use pro model for better creative quality if requested, but flash is great for jokes too.
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
      contents: `Generate a ${selectedVibe} joke. Make it memorable.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            setup: { type: Type.STRING, description: "The hook or first line of the joke." },
            punchline: { type: Type.STRING, description: "The surprising twist or second line." }
          },
          required: ["setup", "punchline"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("The humor module failed to respond.");
    
    return JSON.parse(text) as Joke;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Neural humor link interrupted. Recalibrating comedy circuits...");
  }
};