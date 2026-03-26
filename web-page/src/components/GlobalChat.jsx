"use client";

import { useState } from "react";
import ChatBot from "./ChatBot";

export default function GlobalChat() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {!isOpen && (
                // THE FIX: Changed to a flex container to align the text and button side-by-side
                <div className="fixed bottom-8 right-8 z-[9999] flex items-center space-x-4 animate-fade-in-up">
                    
                    {/* THE NEW TEXT PROMPT */}
                    <div className="bg-white border-2 border-gray-900 text-gray-900 px-4 py-2 rounded-2xl rounded-br-sm text-sm font-black shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] animate-pulse">
                        Need help?
                    </div>

                    {/* The Original Button */}
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 rounded-full bg-simconnect-green border-2 border-gray-900 flex items-center justify-center text-white text-3xl shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] transition-all cursor-pointer"
                    >
                        💬
                    </button>
                </div>
            )}

            {isOpen && <ChatBot onClose={() => setIsOpen(false)} />}
        </>
    );
}