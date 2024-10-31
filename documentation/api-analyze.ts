import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Define our analysis response interface
interface AnalysisResponse {
  behavioralPatterns: {
    maleInsights: string;
    redFlags: string[];
    attachmentStyle: string;
    datingPatterns: string[];
    mixedSignals: string[];
  };
  emphatheticResponse: {
    emotionalSupport: string;
    strategicAdvice: string;
    realityCheck: string;
  };
  actionGuidance: {
    nextSteps: string[];
    boundaries: string[];
    communicationSuggestions: string[];
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { text } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a relationship advisor specializing in analyzing dating situations. 
          Analyze the provided text and return insights in JSON format focusing on:
          1. Male psychology and behavioral patterns
          2. Red flags and warning signs
          3. Attachment styles
          4. Dating patterns and mixed signals
          5. Actionable guidance`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
    });

    const messageContent = completion.choices[0].message?.content;
    if (!messageContent) {
      throw new Error('No content received from OpenAI');
    }

    const analysis = JSON.parse(messageContent) as AnalysisResponse;
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze the text' },
      { status: 500 }
    );
  }
} 