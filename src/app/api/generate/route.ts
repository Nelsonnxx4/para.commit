import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { category, topic, scope, context, breaking } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const scopePart = scope ? `(${scope})` : "";
  const breakingNote = breaking ? "This is a BREAKING CHANGE." : "";

  const prompt = `You are a Git commit message generator following the Conventional Commits spec.

Generate exactly 3 variations of a professional commit message for:
- Type: ${category}
- Scope: ${scope || "none"}
- Topic: ${topic}
- Extra context: ${context || "none"}
- Breaking change: ${breaking ? "yes" : "no"}

Rules:
- Title format: ${category}${scopePart}: <message> (max 72 chars, lowercase, no period)
- Body: 1-2 sentences explaining what and why
- Footer: only if breaking change
${breakingNote}

Respond ONLY with valid JSON, no markdown fences, no extra text:
{
  "commits": [
    { "title": "...", "body": "...", "footer": "..." },
    { "title": "...", "body": "...", "footer": "..." },
    { "title": "...", "body": "...", "footer": "..." }
  ]
}`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate",
        details: error?.toString(),
      },
      { status: 500 }
    );
  }
}
