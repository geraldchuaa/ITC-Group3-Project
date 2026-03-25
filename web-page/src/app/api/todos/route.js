import { NextResponse } from "next/server";

// We changed this to an empty array so there are no default tasks!
let mockDatabase = [];

export async function GET() {
    return NextResponse.json(mockDatabase);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const newTask = {
            id: Date.now(),
            title: body.title,
            status: "pending"
        };
        mockDatabase.push(newTask);
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
    }
}

// NEW: This listens for delete requests from the frontend
export async function DELETE(request) {
    try {
        const body = await request.json();
        // Remove the task that matches the ID sent from the frontend
        mockDatabase = mockDatabase.filter(task => task.id !== body.id);
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}