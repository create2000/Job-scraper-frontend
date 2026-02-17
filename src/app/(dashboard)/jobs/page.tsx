'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Search, MapPin, ExternalLink, Sparkles, Filter, X, CheckCircle2, ChevronRight, ShieldAlert, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    source: string;
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

export default function JobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});

    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSource, setSelectedSource] = useState('');

    const fetchResumes = async () => {
        try {
            const res = await api.get('/resumes');
            if (res.data.length > 0) {
                setSelectedResumeId(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/jobs', {
                    params: {
                        search,
                        location,
                        category: selectedCategory,
                        source: selectedSource,
                        page: 1,
                        limit: 20
                    }
                });
                setJobs(res.data.jobs);
                setHasMore(res.data.jobs.length === 20);
                setPage(1);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
        fetchResumes();
    }, [search, location, selectedCategory, selectedSource]);

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const res = await api.get('/jobs', {
                params: {
                    search,
                    location,
                    category: selectedCategory,
                    source: selectedSource,
                    page: nextPage,
                    limit: 20
                }
            });
            setJobs(prev => [...prev, ...res.data.jobs]);
            setHasMore(res.data.jobs.length === 20);
            setPage(nextPage);
        } catch (err) {
            console.error('Failed to load more jobs:', err);
        }
    };

    const handleAnalyze = async (job: Job) => {
        if (!selectedResumeId) {
            alert('Please upload a resume first in the Resumes section!');
            return;
        }
        setSelectedJob(job);
        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const res = await api.post(`/jobs/${job.id}/analyze-resume`, {
                resumeId: selectedResumeId
            });
            setAnalysisResult(res.data.data);
        } catch (err) {
            console.error(err);
            alert('Analysis failed. Make sure you have enough credits.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExport = async (type: 'pdf' | 'docx') => {
        if (!analysisResult) return;

        try {
            const res = await api.post(`/resumes/export?type=${type}`, {
                ...analysisResult,
                fullName: user?.full_name || 'Professional'
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Optimized_Resume.${type}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Export failed');
        }
    };

    return (
        <div className="pb-20">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Discover Opportunities</h1>
                <p className="text-muted-foreground text-lg font-medium">Browse thousands of jobs scraped specifically for you.</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search job titles or keywords..."
                        className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Location..."
                        className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 border rounded-2xl py-4 px-6 transition-all tracking-tighter ${showFilters ? 'bg-primary text-white border-primary' : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                    <Filter className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Advanced Filters</span>
                </button>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-10"
                    >
                        <div className="bg-card border border-border rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Job Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground font-medium"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Education">Education</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Job Source</label>
                                <select
                                    value={selectedSource}
                                    onChange={(e) => setSelectedSource(e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground font-medium"
                                >
                                    <option value="">All Sources</option>
                                    <option value="Indeed">Indeed</option>
                                    <option value="RemoteOK">RemoteOK</option>
                                    <option value="WeWorkRemotely">We Work Remotely</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Job Grid */}
            <div className="space-y-4">
                {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="bg-muted border border-border h-32 rounded-2xl animate-pulse" />
                    ))
                ) : (
                    <AnimatePresence>
                        {jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="group relative bg-card/60 hover:bg-card border border-border hover:border-primary/50 p-6 rounded-2xl transition-all"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Link href={`/jobs/${job.id}`}>
                                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight cursor-pointer">{job.title}</h3>
                                            </Link>
                                        </div>
                                        <p className="text-foreground/80 font-medium mb-4">{job.company}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5 font-medium italic">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="font-medium italic">Category: {job.category}</span>
                                            <span className="font-medium italic">Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-end md:self-center">
                                        <button
                                            onClick={() => handleAnalyze(job)}
                                            className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-5 py-2.5 rounded-xl transition-all font-bold"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Analyze Match
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const currentlySaved = !!savingMap[job.id];
                                                    if (currentlySaved) {
                                                        await api.delete(`/saved-jobs/jobs/${job.id}/save`);
                                                    } else {
                                                        await api.post(`/saved-jobs/jobs/${job.id}/save`);
                                                    }
                                                    setSavingMap(prev => ({ ...prev, [job.id]: !currentlySaved }));
                                                } catch (err) {
                                                    console.error('Toggle save failed', err);
                                                    alert('Failed to update saved job');
                                                }
                                            }}
                                            className={`px-3 py-2 rounded-xl border ${savingMap[job.id] ? 'bg-rose-500 text-white' : 'bg-card border-border'}`}
                                        >
                                            {savingMap[job.id] ? 'Saved' : 'Save'}
                                        </button>
                                        <Link href={`/jobs/${job.id}`} className="p-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all border border-border">
                                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Load More Button */}
            {jobs.length > 0 && hasMore && (
                <div className="flex justify-center mt-12 mb-10">
                    <button
                        onClick={loadMore}
                        className="bg-primary hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        Load More Jobs
                    </button>
                </div>
            )}
            {jobs.length > 0 && !hasMore && (
                <div className="text-center py-10">
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">No more jobs to load</p>
                </div>
            )}

            {/* Analysis Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-border flex justify-between items-center bg-card/50 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight leading-none mb-1">AI Insights</h2>
                                        <p className="text-sm text-muted-foreground font-bold truncate max-w-75 uppercase tracking-widest">{selectedJob.title}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedJob(null)} className="p-3 hover:bg-muted rounded-2xl transition-all">
                                    <X className="w-6 h-6 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
                                        <h3 className="text-3xl font-black text-foreground mb-3 uppercase tracking-tighter">Running Neural Match...</h3>
                                        <p className="text-muted-foreground italic max-w-xs font-medium">Extracting job semantics and comparing against your professional profile.</p>
                                    </div>
                                ) : analysisResult ? (
                                    <div className="space-y-10">
                                        {/* Score Circle */}
                                        <div className="flex flex-col md:flex-row items-center gap-10 bg-muted/30 p-10 rounded-4xl border border-border">
                                            <div className="relative w-40 h-40 flex items-center justify-center">
                                                <svg className="w-full h-full -rotate-90">
                                                    <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/20" />
                                                    <circle
                                                        cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent"
                                                        strokeDasharray={465}
                                                        strokeDashoffset={465 - (465 * analysisResult.score) / 100}
                                                        className="text-primary transition-all duration-1000 ease-out"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute flex flex-col items-center">
                                                    <span className="text-5xl font-black text-foreground leading-none">{analysisResult.score}%</span>
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Match</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <h4 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tight">Executive Summary</h4>
                                                <p className="text-muted-foreground text-base italic leading-relaxed font-medium">{analysisResult.match_summary}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <h5 className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.15em] text-[10px]">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Key Strengths
                                                </h5>
                                                <div className="space-y-3">
                                                    {analysisResult.strengths?.map((s, i) => (
                                                        <div key={i} className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl text-foreground text-sm font-bold flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                            {s}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h5 className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-[0.15em] text-[10px]">
                                                    <ShieldAlert className="w-4 h-4" />
                                                    Experience Gaps
                                                </h5>
                                                <div className="space-y-3">
                                                    {analysisResult.weaknesses?.map((w, i) => (
                                                        <div key={i} className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl text-foreground text-sm font-bold flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                                            {w}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 border border-border p-8 rounded-4xl">
                                            <h5 className="text-foreground font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                                                <ChevronRight className="w-5 h-5 text-primary" />
                                                AI Recommendations
                                            </h5>
                                            <ul className="grid grid-cols-1 gap-4">
                                                {analysisResult.recommendations?.map((r, i) => (
                                                    <li key={i} className="text-muted-foreground text-sm font-medium flex gap-4 bg-card border border-border p-4 rounded-2xl leading-relaxed">
                                                        <span className="text-primary font-black">#0{i + 1}</span>
                                                        {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="p-8 bg-card/80 border-t border-border flex justify-end items-center gap-4">
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Powered by Gemini Pro</span>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px] shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Export PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('docx')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px] shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Export DOCX
                                    </button>
                                </div>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="bg-muted hover:bg-muted/80 text-foreground font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px] active:scale-95"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
