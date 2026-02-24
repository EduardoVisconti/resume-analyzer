# ResumeAI

AI-powered resume analyzer that provides instant feedback, ATS compatibility checks, keyword analysis, and tailored cover letter generation.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)
![Claude AI](https://img.shields.io/badge/Claude_AI-Sonnet-orange?logo=anthropic)

## Features

- **Resume Analysis** — Upload a PDF or DOCX resume and get a detailed score (1–10) with actionable feedback on strengths, improvements, and red flags.
- **ATS Compatibility** — Identifies keywords present and missing from your resume to help pass Applicant Tracking Systems.
- **Job Match Score** — Paste a job description to get a compatibility percentage and targeted suggestions.
- **Cover Letter Generator** — Generates a professional, tailored cover letter based on your resume and the job description.
- **Dark Mode** — Full light/dark theme support.
- **Demo Mode** — Works without an API key using sample data for portfolio demonstration.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **AI:** Anthropic Claude API (Sonnet)
- **File Parsing:** pdf-parse, mammoth (DOCX)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/eduardovisconti/resume-analyzer.git
cd resume-analyzer
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

> **Note:** The app runs in demo mode with sample data if no API key is provided. To get a key, visit [console.anthropic.com](https://console.anthropic.com).

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
resume-analyzer/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # Resume analysis endpoint
│   │   └── generate-cover-letter/route.ts  # Cover letter endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                      # Main page
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── AnalysisResults.tsx           # Score and feedback display
│   ├── CoverLetterGenerator.tsx      # Cover letter UI
│   ├── FileUpload.tsx                # Drag-and-drop file upload
│   ├── JobDescriptionInput.tsx       # Job description textarea
│   └── ThemeToggle.tsx               # Dark/light mode toggle
├── lib/
│   ├── anthropic.ts                  # AI integration + demo mock data
│   ├── fileParser.ts                 # PDF/DOCX text extraction
│   └── utils.ts                      # Utility functions
└── types/
    └── index.ts                      # TypeScript interfaces
```

## How It Works

1. **Upload** a resume in PDF or DOCX format (max 5MB).
2. **Optionally** paste a job description for targeted analysis.
3. The file is parsed server-side and the extracted text is sent to Claude AI.
4. Claude returns a structured analysis including score, strengths, improvements, red flags, and keyword gaps.
5. Results are displayed in an interactive tabbed interface.
6. A cover letter can be generated using the resume + job description context.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/eduardovisconti/resume-analyzer&env=ANTHROPIC_API_KEY)

Add `ANTHROPIC_API_KEY` as an environment variable in your Vercel project settings. The app will run in demo mode if the variable is not set.

## License

MIT
