import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/fileParser';
import { analyzeResume, isDemoMode, getMockAnalysis } from '@/lib/anthropic';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const jobDescription = formData.get('jobDescription') as string | null;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		const allowedTypes = [
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		];

		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: 'Invalid file type. Please upload a PDF or DOCX file.' },
				{ status: 400 }
			);
		}

		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: 'File too large. Maximum size is 5MB.' },
				{ status: 400 }
			);
		}

		if (file.size === 0) {
			return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		let resumeText: string;
		try {
			resumeText = await extractTextFromFile(buffer, file.type);
		} catch {
			return NextResponse.json(
				{
					error:
						'Failed to extract text from file. The file may be corrupted or image-based.'
				},
				{ status: 422 }
			);
		}

		if (!resumeText || resumeText.length < 50) {
			return NextResponse.json(
				{
					error:
						'Could not extract enough text from the file. Please ensure the resume contains readable text.'
				},
				{ status: 422 }
			);
		}

		if (isDemoMode) {
			return NextResponse.json({
				analysis: getMockAnalysis(jobDescription || undefined),
				resumeText,
				demo: true
			});
		}

		const analysis = await analyzeResume(
			resumeText,
			jobDescription || undefined
		);

		return NextResponse.json({ analysis, resumeText });
	} catch (error) {
		console.error('Analysis error:', error);

		if (error instanceof Error && error.message.includes('rate')) {
			return NextResponse.json(
				{ error: 'Rate limit reached. Please try again in a moment.' },
				{ status: 429 }
			);
		}

		return NextResponse.json(
			{ error: 'An error occurred during analysis. Please try again.' },
			{ status: 500 }
		);
	}
}
