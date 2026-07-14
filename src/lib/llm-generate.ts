import type { GenerateRequest, GeneratedDocuments } from "./types";

function buildUserMessage(input: GenerateRequest): string {
  const { profile, jobDescription, jobTitle, company } = input;
  return [
    "Candidate profile:",
    JSON.stringify(profile, null, 2),
    "",
    `Target job title: ${jobTitle || "(not specified)"}`,
    `Target company: ${company || "(not specified)"}`,
    "",
    "Job description:",
    jobDescription,
  ].join("\n");
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim());
    }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Model did not return valid JSON");
  }
}

export async function llmGenerate(
  input: GenerateRequest
): Promise<GeneratedDocuments> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/$/,
    ""
  );
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: input.prompt },
        { role: "user", content: buildUserMessage(input) },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`LLM request failed (${response.status}): ${detail.slice(0, 400)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("LLM returned an empty response");
  }

  const parsed = extractJsonObject(content) as {
    resume?: unknown;
    coverLetter?: unknown;
  };

  if (typeof parsed.resume !== "string" || typeof parsed.coverLetter !== "string") {
    throw new Error('LLM JSON must include string fields "resume" and "coverLetter"');
  }

  return {
    resume: parsed.resume.trim(),
    coverLetter: parsed.coverLetter.trim(),
    mode: "llm",
  };
}
