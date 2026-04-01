"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("currentUser", JSON.stringify({
          username: data.username,
          ...data.profile,
          schedule: data.schedule || [],
          modules: data.modules || [],
        }));
        router.push("/dashboard");
      } else {
        if (data.incomplete) {
          router.push(`/signup/signup-details?username=${encodeURIComponent(username)}`);
          return;
        }
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setError("Network error. Could not connect to server.");
    }
  }

  function handleGoToSignup() {
    router.push("/signup");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-simconnect-bg">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-10">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-simconnect-green mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6.5" /></svg>
            {/* <span className="text-2xl font-bold text-white">S</span> */}
          </div>
          <h1 className="text-2xl font-extrabold uppercase text-gray-900 tracking-wide">
            SIMConnect
          </h1>
          <p className="text-sm text-gray-500 mt-1">Student Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="student"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-simconnect-green placeholder:text-gray-500 text-simconnect-green"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-simconnect-green placeholder:text-gray-500 text-simconnect-green"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-simconnect-green text-white font-bold text-sm uppercase py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Log In
          </button>
        
        <button
          type="button"
          className="w-full bg-gray-100 text-gray-700 font-bold text-sm uppercase py-2.5 rounded-lg hover:bg-gray-200 transition cursor-pointer"
          onClick={handleGoToSignup}
        >
          Sign Up
        </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Default password: <span className="font-mono">password123</span>
        </p>
      </div>
    </div>
  );
}