import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Verify this path matches your file location
const dataFilePath = path.join(process.cwd(), "src/data/studentInfo.json");

export async function GET() {
    try {
        const fileContents = fs.readFileSync(dataFilePath, "utf8");
        const data = JSON.parse(fileContents);
        // Return the profile object directly
        return NextResponse.json(data.profile);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const fileContents = fs.readFileSync(dataFilePath, "utf8");
        const data = JSON.parse(fileContents);

        // Update the profile fields within the main object
        data.profile = {
            name: body.name,
            initial: body.name ? body.name.charAt(0).toUpperCase() : "C",
            studentId: body.studentId || "",
            email: body.email || "",
            avatar: body.avatar || null
        };

        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}