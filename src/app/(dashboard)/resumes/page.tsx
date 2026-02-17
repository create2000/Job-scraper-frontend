'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Upload,
    FileText,
    Sparkles,
    ChevronRight,
    Plus,
    Briefcase,
    BarChart3,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Resume {
    id: string;
    filename: string;
    created_at: string;
}

export default function ResumesPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const res = await api.get('/resumes');
            setResumes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('resume', file);

        setIsUploading(true);
        try {
            await api.post('/resumes/upload', formData);
            fetchResumes();
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Your Portfolio</h1>
                <p className="text-muted-foreground text-lg font-medium">Manage your professional identity for the Quintly engine.</p>
            </div>

            {/* Portfolio Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <StatCard icon={<Briefcase className="w-6 h-6" />} label="Applications" value="0" />
                <StatCard icon={<BarChart3 className="w-6 h-6" />} label="Avg Match Score" value="0%" />
                <StatCard icon={<FileText className="w-6 h-6" />} label="Resumes" value={resumes.length.toString()} />
                <StatCard icon={<Bell className="w-6 h-6" />} label="Alerts" value="0" />
            </div>

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Your Resumes</h2>
                <label className="cursor-pointer group">
                    <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                    <div className="bg-primary hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95">
                        <Plus className={`w-5 h-5 ${isUploading ? 'animate-spin' : ''}`} />
                        {isUploading ? 'Uploading...' : 'New Resume'}
                    </div>
                </label>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className="bg-card border border-border h-48 rounded-3xl animate-pulse" />)}
                </div>
            ) : resumes.length === 0 ? (
                <div className="bg-card border border-border rounded-3xl p-16 text-center shadow-sm">
                    <h3 className="text-2xl font-bold text-foreground mb-6">No resumes found</h3>
                    <p className="text-muted-foreground font-medium mb-12 max-w-md mx-auto">
                        Upload your first resume to start the AI analysis and get matched with the perfect opportunities.
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg active:scale-95">
                        <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                        <Upload className={`w-5 h-5 ${isUploading ? 'animate-spin' : ''}`} />
                        {isUploading ? 'Uploading...' : 'Upload Resume'}
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {resumes.map((resume) => (
                            <motion.div
                                key={resume.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -4 }}
                                className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-primary/5 rounded-2xl text-primary">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{resume.filename}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Added {new Date(resume.created_at).toLocaleDateString()}</span>
                                            <span className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                AI Ready
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Account section placeholder */}
            <div className="mt-20 pt-12 border-t border-border">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Account</h2>
                    <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                        <Plus className="w-6 h-6 border-2 border-muted-foreground rounded-lg p-0.5" />
                    </button>
                </div>
                {/* Add more account details here if needed */}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[160px]">
            <div className="text-primary group-hover:scale-110 transition-transform w-fit">
                {icon}
            </div>
            <div className="flex items-baseline justify-between mt-6">
                <span className="text-sm font-semibold text-muted-foreground">{label}</span>
                <span className="text-3xl font-bold text-foreground">{value}</span>
            </div>
        </div>
    );
}
