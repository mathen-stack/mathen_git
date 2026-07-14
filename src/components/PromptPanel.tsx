"use client";

type Props = {
  prompt: string;
  onChange: (v: string) => void;
  open: boolean;
  onToggle: () => void;
};

export function PromptPanel({ prompt, onChange, open, onToggle }: Props) {
  return (
    <div className="border-t border-[var(--line)] pt-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <p className="font-display text-xl text-[var(--ink)]">Fixed prompt</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            The system instructions used for every generation. Edit once; reuse for each role.
          </p>
        </div>
        <span className="shrink-0 text-sm text-[var(--accent)]">{open ? "Hide" : "Edit"}</span>
      </button>
      {open ? (
        <textarea
          className="field mt-4 min-h-[16rem] resize-y font-mono text-[13px] leading-relaxed"
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}
