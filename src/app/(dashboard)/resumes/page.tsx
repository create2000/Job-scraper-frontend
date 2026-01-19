'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Upload, FileText, Sparkles, ChevronRight, Plus } from 'lucide-react';
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
        <div className="max-w-5xl mx-auto py-10">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tight">Your Portfolio</h1>
                    <p className="text-muted-foreground text-lg italic">Manage your professional identity for the ChooJobs engine.</p>
                </div>

                <label className="cursor-pointer group">
                    <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                    <div className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-primary/20 group-active:scale-95">
                        <Plus className={`w-6 h-6 ${isUploading ? 'animate-spin' : ''}`} />
                        {isUploading ? 'Uploading...' : 'New Resume'}
                    </div>
                </label>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className="bg-card border border-border h-48 rounded-[2.5rem] animate-pulse" />)}
                </div>
            ) : resumes.length === 0 ? (
                <div className="bg-card border border-border rounded-[3rem] p-20 text-center border-dashed">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 whitespace-nowrap overflow-hidden text-ellipsis">No resumes found</h3>
                    <p className="text-muted-foreground italic mb-8">Upload your first resume to start the AI analysis.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {resumes.map((resume) => (
                            <motion.div
                                key={resume.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-4 bg-muted rounded-2xl text-primary">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors">{resume.filename}</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Added {new Date(resume.created_at).toLocaleDateString()}</span>
                                    <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        AI Ready
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
