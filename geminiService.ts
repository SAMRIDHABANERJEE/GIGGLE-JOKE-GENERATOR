
import { GoogleGenAI, Type } from "@google/genai";
import { Joke, Vibe } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateJoke = async (vibe: Vibe): Promise<Joke> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are a professional comedian and therapist. 
    Your goal is to generate short, clever, 2-line jokes that lift the spirits of people who are sad or tensed.
    Format requirements:
    - Line 1: Setup
    - Line 2: Punchline
    Content Guidelines:
    - Must be witty, surprising, or wholesome.
    - Strictly avoid dark humor, insults, or offensive topics.
    - Style: ${vibe}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Tell me a fresh, uplifting 2-line joke.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            setup: { type: Type.STRING, description: "The setup of the joke." },
            punchline: { type: Type.STRING, description: "The surprising or funny punchline." }
          },
          required: ["setup", "punchline"]
        }
      }
    });

    const jokeData = JSON.parse(response.text || '{}');
    if (!jokeData.setup || !jokeData.punchline) {
      throw new Error("Invalid joke format received");
    }
    return jokeData as Joke;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to summon a joke. The AI might be out of giggles.");
  }
};
