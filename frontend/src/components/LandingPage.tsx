'use client';

import { useState } from 'react';
import { Icons } from './Icon';
import VideoCallPage from './interview';

interface LandingPageProps {
    onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
    const [meetingId, setMeetingId] = useState('');
    const [password, setPassword] = useState('');
    const [joined, setJoined] = useState(false);

    const handleJoinMeeting = (e: React.FormEvent) => {
        e.preventDefault();
         setJoined(true);

    };
  
    return (
        <>
        {!joined && (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Icons.Sparkles className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-slate-800">TalentFlow</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onLoginClick}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Log In
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Sign Up
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                            Seamless Interviews, <br />
                            <span className="text-blue-600">Powered by AI</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-lg mx-auto">
                            Connect with top talent or find your dream job. Join your scheduled interview session directly below.
                        </p>
                    </div>

                    {/* Join Meeting Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md mx-auto w-full transform transition-all hover:scale-[1.01]">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
                            <Icons.Video size={24} className="text-blue-600" />
                            Join a Meeting
                        </h2>
                        <form onSubmit={handleJoinMeeting} className="space-y-4">
                            <div className="text-left">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Meeting ID</label>
                                <input
                                    type="text"
                                    value={meetingId}
                                    onChange={(e) => setMeetingId(e.target.value)}
                                    placeholder="123-456-789"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                                    required
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Join Now <Icons.ChevronRight size={18} />
                            </button>
                        </form>
                    </div>

                    <p className="text-sm text-slate-400">
                        Secure, encrypted video conferencing for professional hiring.
                    </p>
                </div>
            </main>
        </div>
            )}

    {joined && <VideoCallPage />}
        </>
    );
}
