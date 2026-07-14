import type { GenerateRequest, GeneratedDocuments } from "./types";

function firstLine(text: string): string {
  return text.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
}

function bulletsFromBlock(block: string, limit = 6): string[] {
  const lines = block
    .split(/\n+/)
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
  return lines.slice(0, limit);
}

function extractKeywords(jobDescription: string): string[] {
  const stop = new Set([
    "and",
    "the",
    "for",
    "with",
    "you",
    "your",
    "our",
    "will",
    "are",
    "this",
    "that",
    "from",
    "have",
    "has",
    "been",
    "ability",
    "experience",
    "years",
    "team",
    "work",
    "role",
    "job",
    "including",
    "using",
    "strong",
    "preferred",
    "required",
  ]);
  const counts = new Map<string, number>();
  for (const raw of jobDescription.toLowerCase().match(/[a-z][a-z0-9+.#-]{2,}/g) ?? []) {
    if (stop.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

export function mockGenerate(input: GenerateRequest): GeneratedDocuments {
  const { profile, jobDescription, jobTitle, company } = input;
  const role = jobTitle.trim() || "the open role";
  const org = company.trim() || "your company";
  const keywords = extractKeywords(jobDescription);
  const skillList = profile.skills
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const highlightedSkills = [
    ...skillList.filter((s) =>
      keywords.some((k) => s.toLowerCase().includes(k) || k.includes(s.toLowerCase()))
    ),
    ...skillList,
  ]
    .filter((s, i, arr) => arr.findIndex((x) => x.toLowerCase() === s.toLowerCase()) === i)
    .slice(0, 12);

  const experienceBullets = bulletsFromBlock(profile.experience, 8);
  const educationLines = bulletsFromBlock(profile.education, 4);
  const summary =
    profile.summary.trim() ||
    `${profile.fullName || "Candidate"} with experience aligned to ${role} at ${org}.`;

  const resume = [
    `# ${profile.fullName || "Your Name"}`,
    [profile.email, profile.phone, profile.location, profile.linkedin]
      .filter(Boolean)
      .join(" · "),
    "",
    "## Professional Summary",
    summary,
    keywords.length
      ? `Target focus: ${role}${company ? ` at ${org}` : ""}. Emphasizing ${keywords.slice(0, 5).join(", ")}.`
      : "",
    "",
    "## Skills",
    highlightedSkills.length
      ? highlightedSkills.map((s) => `- ${s}`).join("\n")
      : "- Add your skills in the profile to populate this section.",
    "",
    "## Experience",
    experienceBullets.length
      ? experienceBullets.map((b) => `- ${b}`).join("\n")
      : "- Add experience in the profile to populate this section.",
    "",
    "## Education",
    educationLines.length
      ? educationLines.map((b) => `- ${b}`).join("\n")
      : "- Add education in the profile to populate this section.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  const hookSkill = highlightedSkills[0] || keywords[0] || "relevant experience";
  const proof = experienceBullets[0] || firstLine(profile.summary) || "my background";

  const coverLetter = [
    `Dear Hiring Manager${company ? ` at ${org}` : ""},`,
    "",
    `I am writing to apply for the ${role} role. After reviewing the description, I see a strong fit between what you need and how I have delivered — especially around ${hookSkill}.`,
    "",
    `In my recent work, ${proof.charAt(0).toLowerCase()}${proof.slice(1)}. I am comfortable emphasizing the parts of my background that map to this posting without overstating credentials I do not have.`,
    "",
    `I would welcome the chance to discuss how I can contribute at ${org}. Thank you for your time and consideration.`,
    "",
    "Sincerely,",
    profile.fullName || "Your Name",
  ].join("\n");

  return { resume, coverLetter, mode: "mock" };
}
