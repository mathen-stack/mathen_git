"use client";

import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  onChange: (next: Profile) => void;
};

const fields: Array<{
  key: keyof Profile;
  label: string;
  placeholder: string;
  rows?: number;
}> = [
  { key: "fullName", label: "Full name", placeholder: "Alex Rivera" },
  { key: "email", label: "Email", placeholder: "alex@email.com" },
  { key: "phone", label: "Phone", placeholder: "+1 555 0100" },
  { key: "location", label: "Location", placeholder: "Austin, TX" },
  { key: "linkedin", label: "LinkedIn / portfolio", placeholder: "linkedin.com/in/alex" },
  {
    key: "summary",
    label: "Professional summary",
    placeholder: "2–4 sentences about your background and strengths.",
    rows: 4,
  },
  {
    key: "experience",
    label: "Experience",
    placeholder:
      "One role per block. Include title, company, dates, and bullet achievements.",
    rows: 8,
  },
  {
    key: "education",
    label: "Education",
    placeholder: "Degree, school, year — one per line.",
    rows: 3,
  },
  {
    key: "skills",
    label: "Skills",
    placeholder: "Comma-separated or one per line.",
    rows: 3,
  },
];

export function ProfileForm({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.slice(0, 5).map((field) => (
          <label key={field.key} className="block space-y-1.5 sm:[&:nth-child(1)]:col-span-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              {field.label}
            </span>
            <input
              className="field"
              value={profile[field.key]}
              placeholder={field.placeholder}
              onChange={(e) => onChange({ ...profile, [field.key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      {fields.slice(5).map((field) => (
        <label key={field.key} className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            {field.label}
          </span>
          <textarea
            className="field min-h-[6rem] resize-y"
            rows={field.rows}
            value={profile[field.key]}
            placeholder={field.placeholder}
            onChange={(e) => onChange({ ...profile, [field.key]: e.target.value })}
          />
        </label>
      ))}
    </div>
  );
}
