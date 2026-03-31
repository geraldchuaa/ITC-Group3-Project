import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const usersFilePath = path.join(process.cwd(), "src/data/users.json");

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        
        if (!username || !password) {
            return NextResponse.json({ error: "Username and Password are required" }, { status: 400 });
        }

        let users = [];
        if (fs.existsSync(usersFilePath)) {
            const fileContents = fs.readFileSync(usersFilePath, "utf8")
            users = JSON.parse(fileContents);
        }

        const validUser = users.find(
            (user) => user.username === username && user.password === password
        );

        const isDefaultUser = username === "student" && password === "password123";

        if (validUser || isDefaultUser) {
            return NextResponse.json({ message: "Login successful" });
            // router.push("/dashboard");
        } else {
            return NextResponse.json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Failed to login on server" }, { status: 500 });
    }
}