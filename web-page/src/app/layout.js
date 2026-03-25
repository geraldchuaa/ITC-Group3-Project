import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. IMPORT YOUR NEW CHAT COMPONENT HERE
import GlobalChat from "../components/GlobalChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated the metadata to match your app!
export const metadata = {
  title: "SIMConnect",
  description: "Your university student dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* This renders whatever page you are currently on */}
        {children}
        
        {/* 2. DROP THE CHATBOT HERE SO IT FLOATS OVER EVERY PAGE */}
        <GlobalChat />
      </body>
    </html>
  );
}