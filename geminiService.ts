import { GoogleGenAI, Type } from "@google/genai";
import { Joke, Vibe } from "./types.ts";

export const generateJoke = async (vibe: Vibe): Promise<Joke> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const chosenVibe = vibe === Vibe.SURPRISE 
    ? [Vibe.CLEVER, Vibe.ABSURD, Vibe.WHOLESOME, Vibe.WITTY][Math.floor(Math.random() * 4)]
    : vibe;

  const systemInstruction = `
    You are a world-class comedian. 
    Generate a sharp, funny, 2-line joke in the style of: ${chosenVibe}.
    The joke must be uplifting and strictly safe for all audiences.
    
    Response Format:
    - Line 1 (setup): Hook the reader.
    - Line 2 (punchline): Deliver the surprising twist.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Deliver a fresh, high-quality 2-line joke.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            setup: { type: Type.STRING, description: "The setup of the joke." },
            punchline: { type: Type.STRING, description: "The funny payoff." }
          },
          required: ["setup", "punchline"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const jokeData = JSON.parse(text);
    return jokeData as Joke;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("The AI is currently rewriting its material. Try again in a second!");
  }
};