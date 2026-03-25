import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { text, moduleCode } = await req.json();

        // We give the AI a very specific job: act as a study assistant and summarize the notes
        const prompt = `You are an expert academic AI assistant. Please read the following lecture notes for the module ${moduleCode} and provide a clear, concise, and highly structured summary using bullet points. Focus heavily on the key concepts, formulas, and definitions.\n\nNotes Content:\n${text}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'system', content: prompt }],
                temperature: 0.5, // Slightly lower temperature makes the AI more focused and less creative
                max_tokens: 800,
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('OpenAI API Error:', data);
            throw new Error('OpenAI API request failed');
        }

        return NextResponse.json({ summary: data.choices[0].message.content });

    } catch (error) {
        console.error('Summarize API Error:', error);
        return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 500 });
    }
}