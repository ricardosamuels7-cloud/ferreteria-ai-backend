import OpenAI from "openai";
import { config } from "../config";

const client = new OpenAI({ apiKey: config.openaiApiKey });

export type Sentiment = "positive" | "neutral" | "negative";

export async function analyzeSentiment(
  text: string | null | undefined
): Promise<{ sentiment: Sentiment; score: number }> {

  // Normalize input to avoid null errors
  const safeText = text?.trim() ?? "";

  if (safeText.length === 0) {
    return { sentiment: "neutral", score: 0.5 };
  }

  const prompt = `
Eres un analista de reseñas en español.
Clasifica el texto en: "positive", "neutral" o "negative".
Devuelve JSON con "sentiment" y "score" (0 a 1).

Texto:
${safeText}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  // FIX: Prevent null from reaching JSON.parse
  const rawContent = completion?.choices?.[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(rawContent);
    return {
      sentiment: parsed.sentiment || "neutral",
      score: Number(parsed.score) || 0.5
    };
  } catch {
    return { sentiment: "neutral", score: 0.5 };
  }
}



