import { AIAnalysisResult } from './types';

export async function analyzeCandidateProfile(
    candidateName: string,
    resumeText: string,
    jobDescription: string
): Promise<AIAnalysisResult> {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            candidateName,
            resumeText,
            jobDescription,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to analyze candidate');
    }

    return response.json();
}
