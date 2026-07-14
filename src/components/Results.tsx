"use client";

import { downloadPdf, downloadText, fileBase } from "@/lib/download";

type Props = {
  resume: string;
  coverLetter: string;
  fullName: string;
  company: string;
  mode: "llm" | "mock";
  warning?: string;
};

export function Results({
  resume,
  coverLetter,
  fullName,
  company,
  mode,
  warning,
}: Props) {
  const base = fileBase(fullName, company, "docs");

  return (
    <section id="results" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your drafts</p>
          <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
            Resume & cover letter
          </h2>
        </div>
        <p className="rounded-sm bg-[var(--ink)]/5 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          {mode === "llm" ? "LLM tailored" : "Local mock draft"}
        </p>
      </div>

      {warning ? (
        <p className="border-l-2 border-[var(--accent)] bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)]">
          {warning}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <DocumentBlock
          title="Tailored resume"
          content={resume}
          onTxt={() => downloadText(`${fileBase(fullName, company, "resume")}.txt`, resume)}
          onPdf={() =>
            downloadPdf(
              `${fileBase(fullName, company, "resume")}.pdf`,
              "Tailored Resume",
              resume
            )
          }
        />
        <DocumentBlock
          title="Cover letter"
          content={coverLetter}
          onTxt={() =>
            downloadText(`${fileBase(fullName, company, "cover-letter")}.txt`, coverLetter)
          }
          onPdf={() =>
            downloadPdf(
              `${fileBase(fullName, company, "cover-letter")}.pdf`,
              "Cover Letter",
              coverLetter
            )
          }
        />
      </div>

      <p className="text-xs text-[var(--muted)]">
        Files save as <span className="text-[var(--ink)]">{base}-*</span> when a company is set.
      </p>
    </section>
  );
}

function DocumentBlock({
  title,
  content,
  onTxt,
  onPdf,
}: {
  title: string;
  content: string;
  onTxt: () => void;
  onPdf: () => void;
}) {
  return (
    <article className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl text-[var(--ink)]">{title}</h3>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost" onClick={onTxt}>
            Download .txt
          </button>
          <button type="button" className="btn-secondary" onClick={onPdf}>
            Download PDF
          </button>
        </div>
      </div>
      <pre className="doc-preview whitespace-pre-wrap font-serif text-[15px] leading-7 text-[var(--ink)]">
        {content}
      </pre>
    </article>
  );
}
