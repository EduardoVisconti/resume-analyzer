import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<AnalysisResult> {
  const jobDescriptionSection = jobDescription
    ? `\n\nJob Description:\n${jobDescription}\n`
    : "";

  const prompt = `You are an expert resume reviewer and career coach. Analyze this resume and provide detailed, actionable feedback.

Resume Content:
${resumeText}
${jobDescriptionSection}
Provide feedback in this exact JSON structure (and nothing else — no markdown fences, no preamble):
{
  "overallScore": <number 1-10>,
  "summary": "<string>",
  "strengths": ["<string>", ...],
  "improvements": ["<string>", ...],
  "redFlags": ["<string>", ...],
  "keywords": {
    "present": ["<string>", ...],
    "missing": ["<string>", ...]
  },
  "formatting": ["<string>", ...]${jobDescription ? ',\n  "matchScore": <number 0-100>' : ""}
}

Be specific and actionable. Focus on:
- ATS compatibility
- Quantifiable achievements
- Keywords for the role
- Professional formatting
- Grammar and clarity`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const cleaned = responseText
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  const result: AnalysisResult = JSON.parse(cleaned);
  return result;
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string
): Promise<string> {
  const prompt = `Write a professional cover letter based on this resume and job description.

Resume highlights:
${resumeText}

Job Description:
${jobDescription}

Requirements:
- 3 paragraphs (opening, body, closing)
- Highlight 2-3 most relevant achievements
- Professional yet personable tone
- 250-300 words
- Ready to copy/paste

Return only the cover letter text, no preamble.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
