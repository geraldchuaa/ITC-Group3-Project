"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatBot({ onClose }) {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! Student, I'm your academic assistant. How can I help you manage your University life today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessages = [...messages, { role: "user", content: inputValue }];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: newMessages.slice(1) 
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my servers right now." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (actionText) => {
        let prompt = "";
        if (actionText === "Class Schedule") prompt = "Can you summarize my class schedule for me?";
        if (actionText === "Check Attendance") prompt = "How is my attendance looking for my classes?";
        if (actionText === "Help") prompt = "What kind of things can you help me with?";
        
        setInputValue(prompt);
    };

    return (
        <div 
            className="fixed bottom-24 right-8 bg-[#eef8f2] rounded-[2rem] shadow-2xl flex flex-col z-50 border-2 border-gray-900 overflow-hidden animate-fade-in-up"
            style={{ width: '450px', height: '650px', maxWidth: '90vw', maxHeight: '85vh' }}
        >
            
            {/* THE FIX: Refined Header Formatting */}
            <div className="flex-none flex justify-between items-center p-5 border-b-2 border-gray-900 bg-white">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 border-2 border-gray-900 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]">🤖</div>
                    <div>
                        <h3 className="font-extrabold text-base text-gray-900">SIMConnect Assistant</h3>
                        <div className="flex items-center text-xs text-gray-500 font-bold mt-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-simconnect-green mr-2 border border-gray-900"></span> 
                            <span className="uppercase tracking-wider">Online Now</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-transparent hover:border-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
                >
                    <span className="text-xl font-black text-gray-900">✕</span>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        
                        {msg.role === "assistant" && (
                            <div className="w-8 h-8 bg-gray-100 border-2 border-gray-900 rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-sm">🤖</div>
                        )}
                        
                        <div className="max-w-[80%] flex flex-col min-w-0">
                            <div 
                                className={`p-4 text-sm font-bold border-2 border-gray-900 rounded-2xl ${
                                    msg.role === "user" 
                                        ? "bg-white text-gray-900 rounded-br-sm shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]" 
                                        : "bg-simconnect-green text-white rounded-tl-sm shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]"
                                }`}
                                style={{ 
                                    overflowWrap: 'anywhere', 
                                    wordBreak: 'break-word', 
                                    whiteSpace: 'pre-wrap' 
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>

                    </div>
                ))}

                {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 mt-2 pl-11">
                        <button onClick={() => handleQuickAction("Check Attendance")} className="px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] cursor-pointer hover:translate-y-0.5 hover:shadow-none">Check Attendance</button>
                        <button onClick={() => handleQuickAction("Class Schedule")} className="px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] cursor-pointer hover:translate-y-0.5 hover:shadow-none">Class Schedule</button>
                        <button onClick={() => handleQuickAction("Help")} className="px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] cursor-pointer hover:translate-y-0.5 hover:shadow-none">Help</button>
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="w-8 h-8 bg-gray-100 border-2 border-gray-900 rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-sm">🤖</div>
                        <div className="p-4 bg-white border-2 border-gray-900 rounded-2xl rounded-tl-sm shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] flex space-x-1.5 items-center">
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* THE FIX: Flex Container keeps the input and button strictly side-by-side */}
            <div className="flex-none p-5 bg-white border-t-2 border-gray-900">
                <form onSubmit={handleSend} className="flex items-center space-x-3 w-full">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        disabled={isLoading}
                        placeholder={isLoading ? "Assistant is typing..." : "Reply to Assistant..."} 
                        className="flex-1 h-12 pl-5 rounded-full bg-gray-50 border-2 border-gray-900 focus:outline-none focus:bg-white text-sm shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] font-bold text-gray-900 disabled:opacity-70 transition-colors" 
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="flex-none w-12 h-12 flex items-center justify-center bg-simconnect-green border-2 border-gray-900 text-white rounded-full shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]"
                    >
                        <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>

        </div>
    );
}