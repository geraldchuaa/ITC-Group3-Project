import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Grab the chat history sent from the frontend
        const { messages } = await req.json();

        // 1. Get the latest live student data
        const dataFilePath = path.join(process.cwd(), "src/data/studentInfo.json");
        const fileContents = fs.readFileSync(dataFilePath, "utf8");
        const student = JSON.parse(fileContents);

        // 2. Build the "System Prompt" context
        const studentContext = `You are an AI assistant for SIMConnect, a student portal system. You have access to the current student's information and should provide helpful, accurate responses.

        STUDENT INFORMATION:
        Name: ${student.profile.name}

        ENROLLED MODULES (${student.modules.length} modules):
        ${student.modules.map(m => `• ${m.code} - ${m.title}\n  Lecturer: ${m.lecturer}\n  Credits: ${m.credits}`).join('\n')}

        SCHEDULE:
        ${student.schedule.map(s => `• ${s.code} - ${s.name}\n  Time: ${s.time}\n  Location: ${s.location}\n  Days: ${s.days.join(" and ")}`).join('\n')}

        INSTRUCTIONS:
        - Be friendly, conversational, and helpful.
        - Address the student by their first name naturally.
        - Provide specific information from their data when relevant.
        - When discussing schedule, always mention day, time, and location.
        - Keep responses concise and formatted cleanly.`;

        // 3. Send everything to OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // The model from your reference file
                messages: [
                    { role: 'system', content: studentContext },
                    ...messages // Attach the user's actual conversation here
                ],
                temperature: 0.7,
                max_tokens: 500,
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('OpenAI API Error:', data);
            throw new Error(data.error?.message || 'OpenAI API request failed');
        }

        // Return the AI's response to the frontend
        return NextResponse.json({ message: data.choices[0].message.content });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Failed to get AI response. Check your API key.' }, { status: 500 });
    }
}