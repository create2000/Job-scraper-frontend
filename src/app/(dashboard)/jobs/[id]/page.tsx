'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import api from '@/lib/api';
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    Clock,
    Building2,
    Sparkles,
    CheckCircle2,
    ShieldAlert,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    company: string;
    company_website: string;
    employment_type: string;
    remote_type: string;
    category: string;
    created_at: string;
}

interface AnalysisResult {
    score: number;
    match_summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);


    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    const fetchSavedStatus = useCallback(async () => {
        try {
            const res = await api.get(`/saved-jobs/jobs/${id}/status`);
            setIsSaved(res.data.saved === true);
        } catch (err) {
            console.error('Failed to fetch saved status', err);
        }
    }, [id]);

    const toggleSave = async () => {
        try {
            if (isSaved) {
                await api.delete(`/saved-jobs/jobs/${id}/save`);
                setIsSaved(false);
            } else {
                await api.post(`/saved-jobs/jobs/${id}/save`);
                setIsSaved(true);
            }
        } catch (err) {
            console.error('Failed to toggle save', err);
            alert('Failed to update saved jobs');
        }
    };

    const fetchAppliedStatus = useCallback(async () => {
        try {
            await api.get(`/applications/jobs/${id}/status`);
            // If applied, you might want to surface status later
        } catch {
            // ignore
        }
    }, [id]);

    const fetchJob = useCallback(async () => {
        try {
            const res = await api.get(`/jobs/${id}`);
            setJob(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const fetchResumes = useCallback(async () => {
        try {
            const res = await api.get('/resumes');
            if (res.data.length > 0) {
                setSelectedResumeId(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchJob();
        fetchResumes();
        fetchSavedStatus();
        fetchAppliedStatus();
    }, [fetchJob, fetchResumes, fetchSavedStatus, fetchAppliedStatus]);

    const handleAnalyze = async () => {
        if (!selectedResumeId) {
            alert('Please upload a resume first in the Resumes section!');
            return;
        }
        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const res = await api.post(`/jobs/${id}/analyze-resume`, {
                resumeId: selectedResumeId
            });
            setAnalysisResult(res.data.data);
        } catch (err) {
            console.error(err);
            alert('Analysis failed.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-foreground">Job not found</h2>
                <Link href="/jobs" className="text-primary hover:underline mt-4 inline-block">Back to Jobs</Link>
            </div>
        );
    }

    return (
        <div className="pb-20 max-w-5xl mx-auto">
            <Link href="/jobs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
                <ArrowLeft className="w-4 h-4" />
                Back to All Jobs
            </Link>

            <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-sm">
                {/* Hero Header */}
                <div className="p-10 border-b border-border bg-muted/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="relative z-10">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                                {job.category}
                            </span>
                            <span className="bg-muted text-muted-foreground text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Posted {new Date(job.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-6 leading-tight">
                            {job.title}
                        </h1>

                        <div className="flex flex-wrap gap-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-card rounded-2xl border border-border">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Company</p>
                                    <p className="font-bold text-foreground">{job.company}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-card rounded-2xl border border-border">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Location</p>
                                    <p className="font-bold text-foreground">{job.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-card rounded-2xl border border-border">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Type</p>
                                    <p className="font-bold text-foreground capitalize">{job.employment_type || 'Full Time'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Main Content */}
                    <div className="lg:col-span-2 p-10 border-r border-border">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-8">Job Description</h2>
                        <div className="prose prose-invert max-w-none text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="p-10 bg-muted/10 space-y-8">
                        <div className="bg-card border border-border p-8 rounded-4xl shadow-xl">
                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                AI Match Tool
                            </h3>

                            {!analysisResult && !isAnalyzing && (
                                <p className="text-sm text-muted-foreground italic mb-6">Run our neural match engine to see how your profile aligns with this role.</p>
                            )}

                            {isAnalyzing ? (
                                <div className="flex flex-col items-center py-6 text-center">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-xs font-black text-primary uppercase tracking-widest">Analyzing Match...</p>
                                </div>
                            ) : analysisResult ? (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                                                <circle
                                                    cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                    strokeDasharray={377}
                                                    strokeDashoffset={377 - (377 * analysisResult.score) / 100}
                                                    className="text-primary transition-all duration-1000 ease-out"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="absolute text-3xl font-black text-foreground">{analysisResult.score}%</span>
                                        </div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2">Match Quality</span>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handleAnalyze}
                                            className="w-full bg-muted hover:bg-muted font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            Re-run Analysis
                                        </button>

                                        <button
                                            onClick={toggleSave}
                                            className={`w-full ${isSaved ? 'bg-rose-500 text-white' : 'bg-card'} border border-border font-black py-3 rounded-xl transition-all`}
                                        >
                                            {isSaved ? 'Saved' : 'Save Job'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAnalyze}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 active:scale-95"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Run Match Engine
                                </button>
                            )}
                            {/* Persistent Apply CTA */}
                            <div className="mt-4">
                                <button
                                    onClick={() => setIsApplying(true)}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>

                        {analysisResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl">
                                    <h4 className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[9px] mb-3">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Your Edge
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysisResult.strengths.slice(0, 3).map((s, i) => (
                                            <li key={i} className="text-xs font-bold text-foreground flex items-center gap-2">
                                                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-2xl">
                                    <h4 className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-widest text-[9px] mb-3">
                                        <ShieldAlert className="w-4 h-4" />
                                        Gaps to Close
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysisResult.weaknesses.slice(0, 3).map((w, i) => (
                                            <li key={i} className="text-xs font-bold text-foreground flex items-center gap-2">
                                                <div className="w-1 h-1 bg-rose-500 rounded-full" />
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => {/* Scroll to full analysis or open modal */ }}
                                    className="w-full text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                                >
                                    View Full AI Breakdown
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            {/* Apply Modal */}
            {isApplying && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsApplying(false)} />
                    <div className="relative w-full max-w-lg bg-card border border-border p-6 rounded-2xl z-10">
                        <h3 className="text-xl font-black mb-3">Apply to {job?.title}</h3>
                        <div className="space-y-3">
                            <label className="text-sm font-bold">Resume</label>
                            <select value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)} className="w-full p-3 border border-border rounded-xl">
                                <option value="">Select a resume</option>
                                {/* resumes fetched earlier set default; backend returns id & filename */}
                                {/* We'll fetch resumes list on mount via fetchResumes which already runs */}
                            </select>

                            <label className="text-sm font-bold">Cover Letter (optional)</label>
                            <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full p-3 border border-border rounded-xl" rows={5} />

                            <div className="flex gap-3 justify-end mt-4">
                                <button onClick={() => setIsApplying(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
                                <button onClick={async () => {
                                    if (!selectedResumeId) return alert('Please select a resume');
                                    setApplyLoading(true);
                                    try {
                                        await api.post(`/applications/jobs/${id}/apply`, { resumeId: selectedResumeId, coverLetter });
                                        alert('Application submitted');
                                        setIsApplying(false);
                                    } catch (err) {
                                        console.error('Apply failed', err);
                                        let errorMessage = 'Failed to apply';
                                        if (err && typeof err === 'object' && 'response' in err) {
                                            const apiError = err as { response?: { data?: { error?: string } } };
                                            errorMessage = apiError.response?.data?.error || 'Failed to apply';
                                        }
                                        alert(errorMessage);
                                    } finally { setApplyLoading(false); }
                                }} className="px-6 py-2 rounded-xl bg-primary text-white font-bold">
                                    {applyLoading ? 'Applying...' : 'Submit Application'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
