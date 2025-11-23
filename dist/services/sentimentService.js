"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSentiment = analyzeSentiment;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("../config");
const client = new openai_1.default({ apiKey: config_1.config.openaiApiKey });
async function analyzeSentiment(text) {
    // Normalize input
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
    // FIX: Protect JSON.parse
    const rawContent = completion?.choices?.[0]?.message?.content ?? "{}";
    try {
        const parsed = JSON.parse(rawContent);
        return {
            sentiment: parsed.sentiment || "neutral",
            score: Number(parsed.score) || 0.5
        };
    }
    catch (err) {
        return { sentiment: "neutral", score: 0.5 };
    }
}
