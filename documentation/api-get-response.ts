import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUPPORT_MODE_PROMPTS = {
  emotional: `Provide an empathetic and validating response that:
    - Acknowledges and validates the user's feelings
    - Shows understanding of their emotional experience
    - Offers emotional support and comfort
    - Helps them feel heard and understood`,
  
  strategic: `Provide strategic and action-oriented guidance that:
    - Analyzes the situation objectively
    - Offers practical steps and solutions
    - Gives clear, actionable advice
    - Focuses on problem-solving and next steps`,
  
  reality: `Provide an honest, friend-like perspective that:
    - Gives straightforward, unfiltered feedback
    - Points out potential blind spots
    - Challenges unhelpful thinking patterns
    - Offers tough love when needed`
};

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { text, mode } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a relationship advisor specializing in providing support and guidance. 
          ${SUPPORT_MODE_PROMPTS[mode]}
          
          Provide your response in JSON format with the following structure:
          {
            "response": "Main response message",
            "suggestions": ["Suggestion 1", "Suggestion 2", ...],
            "nextSteps": ["Step 1", "Step 2", ...]
          }`
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

    const response = JSON.parse(messageContent);
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Response error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 