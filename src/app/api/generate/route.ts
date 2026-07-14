import { NextResponse } from "next/server";
import { DEFAULT_PROMPT } from "@/lib/default-prompt";
import { llmGenerate } from "@/lib/llm-generate";
import { mockGenerate } from "@/lib/mock-generate";
import type { GenerateRequest, Profile } from "@/lib/types";

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return [
    "fullName",
    "email",
    "phone",
    "location",
    "linkedin",
    "summary",
    "experience",
    "education",
    "skills",
  ].every((key) => typeof p[key] === "string");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateRequest> & {
      forceMock?: boolean;
    };

    if (!isProfile(body.profile)) {
      return NextResponse.json({ error: "Invalid profile payload." }, { status: 400 });
    }
    if (typeof body.jobDescription !== "string" || !body.jobDescription.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    const input: GenerateRequest = {
      profile: body.profile,
      jobDescription: body.jobDescription.trim(),
      jobTitle: typeof body.jobTitle === "string" ? body.jobTitle.trim() : "",
      company: typeof body.company === "string" ? body.company.trim() : "",
      prompt:
        typeof body.prompt === "string" && body.prompt.trim()
          ? body.prompt.trim()
          : DEFAULT_PROMPT,
    };

    const preferLlm = Boolean(process.env.OPENAI_API_KEY) && !body.forceMock;

    if (preferLlm) {
      try {
        const docs = await llmGenerate(input);
        return NextResponse.json(docs);
      } catch (err) {
        const message = err instanceof Error ? err.message : "LLM generation failed";
        // Fall back so the product stays usable without a working key/quota.
        const docs = mockGenerate(input);
        return NextResponse.json({
          ...docs,
          warning: `LLM unavailable (${message}). Returned a local mock draft instead.`,
        });
      }
    }

    const docs = mockGenerate(input);
    return NextResponse.json({
      ...docs,
      warning: process.env.OPENAI_API_KEY
        ? undefined
        : "No OPENAI_API_KEY set — generated a local mock draft. Add a key to enable LLM tailoring.",
    });
  } catch {
    return NextResponse.json({ error: "Could not generate documents." }, { status: 500 });
  }
}
