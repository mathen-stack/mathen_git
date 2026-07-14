# Fitdraft

Tailor a resume and cover letter from three inputs:

1. **Fixed prompt** — reusable system instructions for how drafts should be written
2. **Profile** — your real experience, skills, and education
3. **Job description** — the target role

Then download the results as `.txt` or PDF.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: LLM mode

Without an API key, Fitdraft returns a **local mock draft** (keyword-aligned, still useful for trying the flow).

To enable real LLM tailoring, create `.env.local`:

```bash
OPENAI_API_KEY=sk-...
# Optional overrides:
# OPENAI_BASE_URL=https://api.openai.com/v1
# OPENAI_MODEL=gpt-4o-mini
```

Restart `npm run dev` after adding the key.

## How it works

- UI collects profile + job posting + editable fixed prompt
- `POST /api/generate` calls an OpenAI-compatible chat API when `OPENAI_API_KEY` is set
- Response is JSON with `resume` and `coverLetter` strings
- Client downloads via FileSaver (text) and jsPDF (PDF)

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Local development server |
| `npm run build`| Production build         |
| `npm run start`| Run production server    |
| `npm run lint` | ESLint                   |
