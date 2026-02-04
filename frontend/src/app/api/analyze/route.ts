import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || '';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { candidateName, resumeText, jobDescription } = body;

    if (!apiKey) {
        // Return mock data if no API key is present for demo purposes
        console.warn("No API Key found, returning mock AI analysis.");
        return NextResponse.json({
            summary: `${candidateName} appears to be a strong candidate with relevant experience in the field. Their resume highlights key technical skills required for the role.`,
            strengths: ["Strong technical background", "Relevant project experience", "Good communication skills"],
            weaknesses: ["Limited leadership experience", "Gap in employment history (explained)"],
            matchScore: 85,
            recommendedQuestions: [
                "Can you describe a challenging project you worked on?",
                "How do you handle tight deadlines?",
                "What is your experience with React hooks?"
            ]
        });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
      You are an expert HR AI assistant. Analyze the following candidate based on the job description.
      
      Candidate Name: ${candidateName}
      Resume Text: ${resumeText}
      
      Job Description: ${jobDescription}
      
      Provide a structured JSON response with:
      - summary: A professional summary of the candidate (max 50 words).
      - strengths: An array of 3 key strengths.
      - weaknesses: An array of 2 potential areas of concern or weaknesses.
      - matchScore: A number between 0 and 100 indicating fit.
      - recommendedQuestions: An array of 3 interview questions tailored to this candidate.
    `;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        matchScore: { type: Type.INTEGER },
                        recommendedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["summary", "strengths", "weaknesses", "matchScore", "recommendedQuestions"],
                },
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");

        return NextResponse.json(JSON.parse(text));

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return NextResponse.json({
            summary: "AI analysis unavailable. Please try again later.",
            strengths: [],
            weaknesses: [],
            matchScore: 0,
            recommendedQuestions: []
        }, { status: 500 });
    }
}
