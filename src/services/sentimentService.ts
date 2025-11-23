import OpenAI from "openai";
import { config } from "../config";

const client = new OpenAI({ apiKey: config.openaiApiKey });

export type Sentiment = "positive" | "neutral" | "negative";

export async function analyzeSentiment(text: string): Promise<{ sentiment: Sentiment; score: number }> {
  if (!text || text.trim().length === 0) {
    return { sentiment: "neutral", score: 0.5 };
  }

  const prompt = [
    "Eres un analista de reseñas en español.",
    "Clasifica el texto en: 'positive', 'neutral' o 'negative'.",
    "Devuelve JSON con 'sentiment' y 'score' (0 a 1).",
    "",
    "Texto:",
    text
  ].join("\n");

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  try {
    const parsed = JSON.parse(completion.choices[0].message.content);
    return {
      sentiment: parsed.sentiment,
      score: Number(parsed.score) || 0.8
    };
  } catch {
    return { sentiment: "neutral", score: 0.5 };
  }
}
