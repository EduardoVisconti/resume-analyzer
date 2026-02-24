import { NextRequest, NextResponse } from 'next/server';
import {
	generateCoverLetter,
	isDemoMode,
	getMockCoverLetter
} from '@/lib/anthropic';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { resumeText, jobDescription } = body;

		if (!resumeText || typeof resumeText !== 'string') {
			return NextResponse.json(
				{ error: 'Resume text is required.' },
				{ status: 400 }
			);
		}

		if (!jobDescription || typeof jobDescription !== 'string') {
			return NextResponse.json(
				{ error: 'Job description is required for cover letter generation.' },
				{ status: 400 }
			);
		}

		if (resumeText.length < 50) {
			return NextResponse.json(
				{
					error:
						'Resume text is too short to generate a meaningful cover letter.'
				},
				{ status: 400 }
			);
		}

		if (isDemoMode) {
			return NextResponse.json({
				coverLetter: getMockCoverLetter(),
				demo: true
			});
		}

		const coverLetter = await generateCoverLetter(resumeText, jobDescription);

		return NextResponse.json({ coverLetter });
	} catch (error) {
		console.error('Cover letter generation error:', error);

		if (error instanceof Error && error.message.includes('rate')) {
			return NextResponse.json(
				{ error: 'Rate limit reached. Please try again in a moment.' },
				{ status: 429 }
			);
		}

		return NextResponse.json(
			{
				error:
					'An error occurred during cover letter generation. Please try again.'
			},
			{ status: 500 }
		);
	}
}
