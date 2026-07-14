"use client";

type Props = {
  jobTitle: string;
  company: string;
  jobDescription: string;
  onJobTitle: (v: string) => void;
  onCompany: (v: string) => void;
  onJobDescription: (v: string) => void;
};

export function JobForm({
  jobTitle,
  company,
  jobDescription,
  onJobTitle,
  onCompany,
  onJobDescription,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Job title
          </span>
          <input
            className="field"
            value={jobTitle}
            placeholder="Senior Product Designer"
            onChange={(e) => onJobTitle(e.target.value)}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Company
          </span>
          <input
            className="field"
            value={company}
            placeholder="Northwind Labs"
            onChange={(e) => onCompany(e.target.value)}
          />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          Job description
        </span>
        <textarea
          className="field min-h-[18rem] resize-y"
          value={jobDescription}
          placeholder="Paste the full job description here…"
          onChange={(e) => onJobDescription(e.target.value)}
        />
      </label>
    </div>
  );
}
