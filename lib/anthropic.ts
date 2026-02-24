import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult } from '@/types';

export const isDemoMode = !process.env.ANTHROPIC_API_KEY;

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY
});

export async function analyzeResume(
	resumeText: string,
	jobDescription?: string
): Promise<AnalysisResult> {
	const jobDescriptionSection = jobDescription
		? `\n\nJob Description:\n${jobDescription}\n`
		: '';

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
  "formatting": ["<string>", ...]${jobDescription ? ',\n  "matchScore": <number 0-100>' : ''}
}

Be specific and actionable. Focus on:
- ATS compatibility
- Quantifiable achievements
- Keywords for the role
- Professional formatting
- Grammar and clarity`;

	const message = await anthropic.messages.create({
		model: 'claude-sonnet-4-20250514',
		max_tokens: 2048,
		messages: [{ role: 'user', content: prompt }]
	});

	const responseText =
		message.content[0].type === 'text' ? message.content[0].text : '';

	const cleaned = responseText
		.replace(/```json\s*/g, '')
		.replace(/```\s*/g, '')
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
		model: 'claude-sonnet-4-20250514',
		max_tokens: 1024,
		messages: [{ role: 'user', content: prompt }]
	});

	return message.content[0].type === 'text' ? message.content[0].text : '';
}

export function getMockAnalysis(jobDescription?: string): AnalysisResult {
	return {
		overallScore: 7,
		summary:
			'This is a demo analysis. Connect your Anthropic API key for real AI-powered feedback. The resume shows a solid foundation with room for improvement in quantifiable achievements and keyword optimization.',
		strengths: [
			'Clean and professional formatting with consistent structure',
			'Relevant technical skills clearly listed',
			'Education section is well-organized'
		],
		improvements: [
			"Add quantifiable achievements (e.g., 'Increased performance by 40%')",
			'Include more action verbs at the start of bullet points',
			'Add a professional summary section at the top'
		],
		redFlags: [
			'No measurable impact or metrics mentioned',
			'Gaps in employment history not addressed'
		],
		keywords: {
			present: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
			missing: ['CI/CD', 'Testing', 'Agile', 'REST API', 'Performance']
		},
		formatting: [
			'Consider using a single-column layout for better ATS compatibility',
			'Ensure consistent date formatting throughout'
		],
		...(jobDescription ? { matchScore: 68 } : {})
	};
}

export function getMockCoverLetter(): string {
	return `Dear Hiring Manager,

I am writing to express my strong interest in this position. With my background in modern web development and a passion for creating exceptional user experiences, I believe I would be a valuable addition to your team.

Throughout my career, I have developed expertise in React, TypeScript, and Next.js, delivering projects that prioritize performance, accessibility, and clean code architecture. My experience collaborating with cross-functional teams has strengthened my ability to translate complex requirements into elegant, maintainable solutions.

I would welcome the opportunity to discuss how my skills and enthusiasm align with your team's goals. Thank you for considering my application, and I look forward to hearing from you.

Best regards`;
}
