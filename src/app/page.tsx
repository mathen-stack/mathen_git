"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { JobForm } from "@/components/JobForm";
import { ProfileForm } from "@/components/ProfileForm";
import { PromptPanel } from "@/components/PromptPanel";
import { Results } from "@/components/Results";
import { DEFAULT_PROMPT } from "@/lib/default-prompt";
import { emptyProfile, type GeneratedDocuments, type Profile } from "@/lib/types";

const sampleProfile: Profile = {
  fullName: "Jordan Lee",
  email: "jordan.lee@email.com",
  phone: "+1 415 555 0199",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/jordanlee",
  summary:
    "Product-minded software engineer with 6 years building customer-facing web apps. Strong in TypeScript, React, and API design. Known for shipping reliable features and mentoring junior engineers.",
  experience: `Senior Software Engineer — Cascade Health (2022–Present)
- Led rebuild of patient scheduling UI in React/TypeScript, cutting booking drop-off 18%
- Designed REST APIs used by mobile and web; improved p95 latency by 35%
- Mentored 3 engineers; introduced PR review checklist still used by the team

Software Engineer — Northline (2019–2022)
- Built billing dashboard and webhook pipeline processing 2M events/month
- Collaborated with design on accessibility pass (WCAG AA)`,
  education: `B.S. Computer Science — University of Washington (2019)`,
  skills: "TypeScript, React, Next.js, Node.js, PostgreSQL, REST APIs, System design, Mentoring",
};

const sampleJd = `We are hiring a Senior Frontend Engineer to own critical product surfaces.

You will:
- Build polished React/TypeScript interfaces used by thousands of customers daily
- Partner with design and backend to ship end-to-end features
- Improve performance, accessibility, and maintainability of our Next.js app
- Mentor engineers and raise the quality bar through thoughtful code review

Requirements:
- 5+ years professional frontend experience
- Strong TypeScript and React
- Experience with REST APIs and modern CSS
- Clear written communication

Nice to have: Next.js, design systems, healthcare domain.`;

export default function Home() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [promptOpen, setPromptOpen] = useState(false);
  const [result, setResult] = useState<(GeneratedDocuments & { warning?: string }) | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function loadSample() {
    setProfile(sampleProfile);
    setJobTitle("Senior Frontend Engineer");
    setCompany("Bright Harbor");
    setJobDescription(sampleJd);
    setError(null);
  }

  function generate() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            jobTitle,
            company,
            jobDescription,
            prompt,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Generation failed.");
          return;
        }
        setResult(data);
        requestAnimationFrame(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
        });
      } catch {
        setError("Network error — could not reach the generate API.");
      }
    });
  }

  const canGenerate =
    Boolean(profile.fullName.trim()) && Boolean(jobDescription.trim()) && !pending;

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-2xl tracking-tight text-[var(--ink)]">
            Fitdraft
          </Link>
          <button type="button" className="btn-ghost" onClick={loadSample}>
            Load sample
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-atmosphere" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pb-24 sm:pt-20">
            <p className="font-display text-5xl leading-[0.95] text-[var(--ink)] sm:text-7xl md:text-8xl">
              Fitdraft
            </p>
            <h1 className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-[var(--ink-soft)] sm:text-xl">
              Paste your profile and a job description. One fixed prompt turns them into a
              tailored resume and cover letter you can download.
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#workspace" className="btn-primary">
                Start tailoring
              </a>
              <button type="button" className="btn-secondary" onClick={loadSample}>
                Try with sample data
              </button>
            </div>
          </div>
        </section>

        <section id="workspace" className="mx-auto max-w-6xl space-y-12 px-6 py-14 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="eyebrow">Step 1</p>
              <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
                Your profile
              </h2>
              <p className="text-[var(--muted)]">
                Reuse this for every application. Only real experience belongs here.
              </p>
              <ProfileForm profile={profile} onChange={setProfile} />
            </div>
            <div className="space-y-4">
              <p className="eyebrow">Step 2</p>
              <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
                Target role
              </h2>
              <p className="text-[var(--muted)]">
                Drop in the posting. Fitdraft aligns language and emphasis to this job.
              </p>
              <JobForm
                jobTitle={jobTitle}
                company={company}
                jobDescription={jobDescription}
                onJobTitle={setJobTitle}
                onCompany={setCompany}
                onJobDescription={setJobDescription}
              />
            </div>
          </div>

          <PromptPanel
            prompt={prompt}
            onChange={setPrompt}
            open={promptOpen}
            onToggle={() => setPromptOpen((v) => !v)}
          />

          <div className="flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-8">
            <button
              type="button"
              className="btn-primary"
              disabled={!canGenerate}
              onClick={generate}
            >
              {pending ? "Generating…" : "Generate resume & letter"}
            </button>
            {!profile.fullName.trim() || !jobDescription.trim() ? (
              <p className="text-sm text-[var(--muted)]">
                Add your name and a job description to continue.
              </p>
            ) : null}
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </div>

          {result ? (
            <Results
              resume={result.resume}
              coverLetter={result.coverLetter}
              fullName={profile.fullName}
              company={company}
              mode={result.mode}
              warning={result.warning}
            />
          ) : null}
        </section>
      </main>

      <footer className="border-t border-[var(--line)] px-6 py-8 text-center text-sm text-[var(--muted)]">
        Fitdraft · Profile + job description + fixed prompt → downloadable drafts
      </footer>
    </div>
  );
}
