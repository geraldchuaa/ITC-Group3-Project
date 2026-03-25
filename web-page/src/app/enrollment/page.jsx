"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import studentData from "@/data/studentInfo.json";

export default function EnrollmentPage() {
    const [formData, setFormData] = useState({
        code: "", name: "", instructor: "", credits: "", time: "", location: "", days: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // NEW: State to hold our error messages
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear the error message as soon as the user starts typing again
        if (errorMsg) setErrorMsg("");
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        
        // 1. CHECK: Are any fields completely empty?
        const hasEmptyFields = Object.values(formData).some(value => !value.trim());
        if (hasEmptyFields) {
            setErrorMsg("Please fill out every field before enrolling.");
            return; // Stops the function from running
        }

        // 2. CHECK: Is the time formatted exactly right?
        // This regex looks for: 2 numbers : 2 numbers (am/pm) - 2 numbers : 2 numbers (am/pm)
        const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9](am|pm) - (0[1-9]|1[0-2]):[0-5][0-9](am|pm)$/i;
        
        if (!timeRegex.test(formData.time.trim())) {
            setErrorMsg("Invalid time format. Please use exactly this format: 01:00pm - 02:30pm");
            return; // Stops the function from running
        }

        // If it passes the checks, proceed with saving!
        setIsSubmitting(true);
        setErrorMsg(""); 

        const response = await fetch("/api/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Successfully enrolled! The page will now refresh.");
            window.location.reload(); 
        } else {
            setErrorMsg("Server error: Could not enroll in the class.");
        }
        setIsSubmitting(false);
    };

    const handleDrop = async (code) => {
        if (!confirm(`Are you sure you want to drop ${code}?`)) return;

        const response = await fetch("/api/enroll", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });

        if (response.ok) {
            window.location.reload(); 
        }
    };

    return (
        <div className="flex min-h-screen bg-simconnect-bg relative">
            <Sidebar />

            <main className="flex-1 p-8 md:p-12 h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-900">
                    <div>
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">📝</span>
                            <h1 className="text-3xl font-extrabold uppercase text-gray-900">SUBJECT ENROLLMENT</h1>
                        </div>
                        <p className="text-sm font-bold text-gray-600 mt-2 uppercase tracking-wider">Manage your courses</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* LEFT SIDE: Add New Module Form */}
                    <div className="bg-white border-2 border-gray-900 rounded-xl p-8 shadow-sm h-fit">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-6 uppercase border-b-2 border-gray-200 pb-2">Enroll in a New Module</h2>
                        
                        {/* NEW: Display the error message if there is one */}
                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-md">
                                ⚠️ {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleEnroll} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course Code</label>
                                    <input required type="text" name="code" placeholder="e.g. ENG-101" value={formData.code} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 outline-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Credits</label>
                                    <input required type="number" name="credits" placeholder="e.g. 3" value={formData.credits} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 outline-none font-medium" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course Title</label>
                                <input required type="text" name="name" placeholder="e.g. Academic Writing" value={formData.name} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 outline-none font-medium" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instructor</label>
                                    <input required type="text" name="instructor" placeholder="e.g. Dr. Adams" value={formData.instructor} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 outline-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                                    <input required type="text" name="location" placeholder="e.g. Room 3B" value={formData.location} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 outline-none font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Days (Comma Separated)</label>
                                    <input required type="text" name="days" placeholder="Monday, Wednesday" value={formData.days} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 outline-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Time</label>
                                    <input required type="text" name="time" placeholder="01:00pm - 02:30pm" value={formData.time} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 outline-none font-medium" />
                                </div>
                            </div>

                            <button disabled={isSubmitting} type="submit" className="w-full mt-4 py-4 bg-simconnect-button border-2 border-gray-900 text-gray-900 font-extrabold uppercase rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm disabled:opacity-50">
                                {isSubmitting ? "Enrolling..." : "Complete Enrollment"}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SIDE: Current Modules */}
                    <div className="bg-white border-2 border-gray-900 rounded-xl p-8 shadow-sm h-fit">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-6 uppercase border-b-2 border-gray-200 pb-2">Currently Enrolled</h2>
                        
                        <div className="space-y-4">
                            {studentData.modules.length === 0 ? (
                                <p className="text-gray-500 font-medium">You have no enrolled classes.</p>
                            ) : (
                                studentData.modules.map((mod, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                                        <div>
                                            <h3 className="font-extrabold text-gray-900 text-lg">{mod.code}</h3>
                                            <p className="text-xs font-bold text-gray-600 uppercase">{mod.title}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDrop(mod.code)}
                                            className="px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 font-bold text-xs uppercase rounded-md hover:bg-red-100 hover:border-red-600 transition-all cursor-pointer"
                                        >
                                            Drop
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}