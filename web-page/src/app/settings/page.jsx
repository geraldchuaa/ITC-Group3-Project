"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
// Directly importing to ensure fields are pre-filled on the very first render
import studentData from "@/data/studentInfo.json";

export default function SettingsPage() {
    // --- Profile States ---
    const [name, setName] = useState(studentData.profile.name || "");
    const [studentId, setStudentId] = useState(studentData.profile.studentId || "");
    const [email, setEmail] = useState(studentData.profile.email || "");
    const [avatar, setAvatar] = useState(studentData.profile.avatar === "NULL" ? null : studentData.profile.avatar);
    
    const [profileSaved, setProfileSaved] = useState(false);
    const [profileError, setProfileError] = useState("");

    // --- Password States ---
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMsg, setPasswordMsg] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Refresh data from API to ensure sync with the database file
    useEffect(() => {
        fetch("/api/profile")
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setName(data.name || "");
                    setStudentId(data.studentId || "");
                    setEmail(data.email || "");
                    setAvatar(data.avatar === "NULL" ? null : data.avatar);
                }
            })
            .catch(err => console.error("Failed to sync profile", err));
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => setAvatar(null);

    async function handleSaveProfile(e) {
        e.preventDefault();
        setProfileSaved(false);
        setProfileError("");

        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, studentId, email, avatar }),
            });
            if (res.ok) {
                setProfileSaved(true);
                setTimeout(() => setProfileSaved(false), 3000);
            } else {
                setProfileError("Failed to save profile.");
            }
        } catch {
            setProfileError("Failed to save profile.");
        }
    }

    function handleChangePassword(e) {
        e.preventDefault();
        setPasswordMsg("");
        setPasswordError("");
        
        // Mock validation logic
        if (currentPassword !== "password123") {
            setPasswordError("Current password is incorrect.");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setPasswordMsg("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordMsg(""), 3000);
    }

    const initial = name.trim() ? name.trim()[0].toUpperCase() : "?";

    return (
        <div className="flex min-h-screen bg-simconnect-bg relative">
            <Sidebar />

            <main className="flex-1 p-8 md:p-12 h-screen overflow-y-auto">

                {/* Header */}
                <div className="flex items-center mb-8 pb-4 border-b-2 border-gray-900">
                    <div className="flex items-center space-x-3">
                        <span className="text-3xl">⚙️</span>
                        <div>
                            <h1 className="text-3xl font-extrabold uppercase text-gray-900">Settings</h1>
                            <p className="text-sm font-bold text-gray-600 mt-1 uppercase tracking-wider">Manage your account</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl space-y-6">

                    {/* Profile Section */}
                    <div className="bg-white border-2 border-gray-900 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b-2 border-gray-900 bg-gray-50">
                            <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-900">Profile Settings</h2>
                        </div>

                        <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                            <div className="flex items-center space-x-6">
                                <label className="relative cursor-pointer group">
                                    <div className="w-20 h-20 rounded-full bg-simconnect-green flex items-center justify-center text-white text-3xl font-black border-2 border-gray-900 overflow-hidden shadow-md">
                                        {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : initial}
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-900">{name || "Student Name"}</p>
                                    <div className="flex gap-3">
                                        <label className="text-[10px] font-black uppercase text-simconnect-green cursor-pointer hover:underline">
                                            Upload New 
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                        {avatar && (
                                            <button type="button" onClick={handleRemoveAvatar} className="text-[10px] font-black uppercase text-red-500 hover:underline">
                                                Remove Photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-xl outline-none font-semibold text-simconnect-green focus:border-simconnect-green" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Student ID</label>
                                    <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-xl outline-none font-semibold text-simconnect-green focus:border-simconnect-green" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-xl outline-none font-semibold text-simconnect-green focus:border-simconnect-green" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-6 py-2.5 bg-simconnect-green text-white text-sm font-bold uppercase rounded-xl border-2 border-gray-900 hover:opacity-90 shadow-sm transition-opacity">
                                    Save Profile
                                </button>
                            </div>
                            {profileSaved && <p className="text-xs font-bold text-emerald-600 mt-2 text-right">Settings saved!</p>}
                            {profileError && <p className="text-xs font-bold text-red-500 mt-2 text-right">{profileError}</p>}
                        </form>
                    </div>

                    {/* Change Password Section */}
                    <div className="bg-white border-2 border-gray-900 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b-2 border-gray-900 bg-gray-50">
                            <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-900">Change Password</h2>
                        </div>
                        <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Current Password</label>
                                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-simconnect-green outline-none font-semibold text-simconnect-green" placeholder="Default: password123" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-simconnect-green outline-none font-semibold text-simconnect-green" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-simconnect-green outline-none font-semibold text-simconnect-green" required />
                            </div>
                            {passwordMsg && <p className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">{passwordMsg}</p>}
                            {passwordError && <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{passwordError}</p>}
                            <div className="flex justify-end">
                                <button type="submit" className="px-6 py-2.5 bg-simconnect-green text-white text-sm font-bold uppercase rounded-xl border-2 border-gray-900 hover:opacity-90 transition-opacity">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* About Section */}
                    <div className="bg-white border-2 border-gray-900 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b-2 border-gray-900 bg-gray-50">
                            <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-900">About</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">App</span>
                                <span className="text-sm font-bold text-gray-900">SIMConnect</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Version</span>
                                <span className="text-sm font-bold text-gray-900">1.0.0</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Team</span>
                                <span className="text-sm font-bold text-gray-900">ITC Group 3</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}