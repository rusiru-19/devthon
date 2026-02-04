'use client';

import { useState, useEffect } from 'react';
import { MOCK_CANDIDATES } from '@/lib/constants';
import { Candidate, AIAnalysisResult } from '@/lib/types';
import { Icons } from './Icon';
import { analyzeCandidateProfile } from '@/lib/geminiClient';

interface CandidateDrawerProps {
    candidate: Candidate | null;
    onClose: () => void;
}

function CandidateDrawer({ candidate, onClose }: CandidateDrawerProps) {
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAnalysis(null);
    }, [candidate]);

    if (!candidate) return null;

    const handleAIAnalysis = async () => {
        setLoading(true);
        const jobDesc = "Generic Role";

        try {
            const result = await analyzeCandidateProfile(candidate.name, candidate.resumeText, jobDesc);
            setAnalysis(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl pointer-events-auto overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                            {candidate.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{candidate.name}</h2>
                            <p className="text-slate-500">{candidate.role}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <Icons.X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        <button className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-200">
                            Schedule Interview
                        </button>
                        <button className="flex-1 py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
                            Send Email
                        </button>
                        <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                            <Icons.More size={20} />
                        </button>
                    </div>

                    {/* AI Analysis Section */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold">
                                <Icons.Sparkles className="w-5 h-5 text-indigo-600" />
                                <span>AI Candidate Insights</span>
                            </div>
                            {analysis && (
                                <span className={`text-lg font-bold px-3 py-1 rounded-full ${analysis.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                                    analysis.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {analysis.matchScore}% Match
                                </span>
                            )}
                        </div>

                        {!analysis ? (
                            <button
                                onClick={handleAIAnalysis}
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                {loading ? <Icons.Loader className="animate-spin" /> : <Icons.Sparkles size={18} />}
                                {loading ? 'Analyzing Profile...' : 'Analyze Match Score'}
                            </button>
                        ) : (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="bg-white/60 p-4 rounded-lg">
                                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-2">Summary</h4>
                                    <p className="text-sm text-indigo-900 leading-relaxed">{analysis.summary}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50/80 p-3 rounded-lg border border-green-100">
                                        <h4 className="text-xs font-bold text-green-800 uppercase tracking-wide mb-2">Strengths</h4>
                                        <ul className="text-xs space-y-1 text-green-800">
                                            {analysis.strengths.map((s, i) => <li key={i} className="flex gap-2"><span>•</span>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div className="bg-red-50/80 p-3 rounded-lg border border-red-100">
                                        <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide mb-2">Concerns</h4>
                                        <ul className="text-xs space-y-1 text-red-800">
                                            {analysis.weaknesses.map((s, i) => <li key={i} className="flex gap-2"><span>•</span>{s}</li>)}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-white/60 p-4 rounded-lg">
                                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-2">Suggested Questions</h4>
                                    <ul className="space-y-2">
                                        {analysis.recommendedQuestions.map((q, i) => (
                                            <li key={i} className="text-sm text-indigo-800 flex gap-2">
                                                <span className="font-bold text-indigo-400">{i + 1}.</span>
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Email</span>
                                <p className="text-sm font-medium text-slate-900 mt-1">{candidate.email}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Applied Date</span>
                                <p className="text-sm font-medium text-slate-900 mt-1">{new Date(candidate.appliedDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill) => (
                                <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Resume Preview (Mock) */}
                    <div className="h-48 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <Icons.FileText size={32} className="mb-2" />
                        <span className="text-sm">Resume Preview Unavailable</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export function Candidates() {
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCandidates = MOCK_CANDIDATES.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
                        <p className="text-slate-500">Manage and track your applicant pipeline.</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                        <Icons.Upload size={18} />
                        Bulk Upload CVs
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex-1 relative">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                            <Icons.Filter size={16} />
                            Filters
                        </button>
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
                            Sort: Newest
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Match</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCandidates.map((candidate) => (
                                    <tr
                                        key={candidate.id}
                                        onClick={() => setSelectedCandidate(candidate)}
                                        className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {candidate.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{candidate.name}</p>
                                                    <p className="text-xs text-slate-500">{candidate.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-700">{candidate.role}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${candidate.matchScore >= 80 ? 'bg-green-500' :
                                                            candidate.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${candidate.matchScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-slate-600">{candidate.matchScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${candidate.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                candidate.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                                                    candidate.status === 'Offer' ? 'bg-green-100 text-green-800' :
                                                        candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-slate-100 text-slate-800'
                                                }`}>
                                                {candidate.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(candidate.appliedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Icons.ChevronRight className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredCandidates.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            <Icons.Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                            <p>No candidates found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            <CandidateDrawer
                candidate={selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
            />
        </>
    );
}
