import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message.content || "";
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate commit messages." },
      { status: 500 }
    );
  }
}
