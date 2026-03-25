"use client";

import { useState } from "react";
import ChatBot from "./ChatBot";

export default function GlobalChat() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {!isOpen && (
                <div className="fixed bottom-8 right-8 z-[9999] animate-fade-in-up">
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