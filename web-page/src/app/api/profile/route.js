import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const dataFilePath = path.join(process.cwd(), "src/data/studentInfo.json");

function getStudentData() {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
}

export async function PATCH(request) {
    try {
        const { name, studentId, email } = await request.json();
        if (!name || !name.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }
        const data = getStudentData();
        data.profile.name = name.trim();
        data.profile.initial = name.trim()[0].toUpperCase();
        data.profile.studentId = studentId ? studentId.Id.trim() : "";
        data.profile.email = email ? email.trim() : "";
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
