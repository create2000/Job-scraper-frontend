'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Upload,
    FileText,
    Sparkles,
    Plus,
    Briefcase,
    BarChart3,
    Bell,
    Trash2,
    CheckCircle2,
    Star,
    AlertTriangle,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Resume {
    id: string;
    filename: string;
    created_at: string;
    is_active: boolean;
}

export default function ResumesPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [settingActiveId, setSettingActiveId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Resume | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchResumes();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

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
            await fetchResumes();
            showToast('Resume uploaded successfully!', 'success');
        } catch {
            showToast('Upload failed. Please try again.', 'error');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (resume: Resume) => {
        setDeletingId(resume.id);
        try {
            await api.delete(`/resumes/${resume.id}`);
            setResumes(prev => prev.filter(r => r.id !== resume.id));
            showToast(`"${resume.filename}" deleted.`, 'success');
        } catch {
            showToast('Failed to delete resume. Try again.', 'error');
        } finally {
            setDeletingId(null);
            setConfirmDelete(null);
        }
    };

    const handleSetActive = async (resume: Resume) => {
        if (resume.is_active) return;
        setSettingActiveId(resume.id);
        try {
            await api.patch(`/resumes/${resume.id}/set-active`);
            setResumes(prev => prev.map(r => ({ ...r, is_active: r.id === resume.id })));
            showToast(`"${resume.filename}" is now your active resume.`, 'success');
        } catch {
            showToast('Failed to set active resume. Try again.', 'error');
        } finally {
            setSettingActiveId(null);
        }
    };

    const activeResume = resumes.find(r => r.is_active);

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        key="toast"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold
                            ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Delete Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
                        onClick={() => setConfirmDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <button onClick={() => setConfirmDelete(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Delete Resume?</h3>
                            <p className="text-muted-foreground mb-2 text-sm">
                                You are about to permanently delete:
                            </p>
                            <p className="text-foreground font-semibold mb-6 bg-muted px-4 py-2.5 rounded-xl text-sm truncate">
                                📄 {confirmDelete.filename}
                            </p>
                            <p className="text-muted-foreground text-sm mb-8">
                                This will also remove all AI analyses linked to this resume. This action <strong>cannot be undone</strong>.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="flex-1 py-3 rounded-xl border border-border font-semibold text-foreground hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(confirmDelete)}
                                    disabled={deletingId === confirmDelete.id}
                                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {deletingId === confirmDelete.id ? (
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    {deletingId === confirmDelete.id ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Your Portfolio</h1>
                <p className="text-muted-foreground text-lg font-medium">Manage your professional identity for the Quintly engine.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <StatCard icon={<Briefcase className="w-6 h-6" />} label="Applications" value="0" />
                <StatCard icon={<BarChart3 className="w-6 h-6" />} label="Avg Match Score" value="0%" />
                <StatCard icon={<FileText className="w-6 h-6" />} label="Resumes" value={resumes.length.toString()} />
                <StatCard icon={<Bell className="w-6 h-6" />} label="Alerts" value="0" />
            </div>

            {/* Active Resume Banner */}
            {activeResume && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-6 py-4"
                >
                    <Star className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Active Resume</p>
                        <p className="text-foreground font-bold text-sm truncate max-w-xs">{activeResume.filename}</p>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground">Used for AI analysis by default</span>
                </motion.div>
            )}

            {/* Section Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Your Resumes</h2>
                <label className="cursor-pointer">
                    <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept=".pdf,.docx" />
                    <div className="bg-primary hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95">
                        <Plus className={`w-5 h-5 ${isUploading ? 'animate-spin' : ''}`} />
                        {isUploading ? 'Uploading...' : 'New Resume'}
                    </div>
                </label>
            </div>

            {/* Resume List */}
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
                        <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept=".pdf,.docx" />
                        <Upload className={`w-5 h-5 ${isUploading ? 'animate-spin' : ''}`} />
                        {isUploading ? 'Uploading...' : 'Upload Resume'}
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {resumes.map((resume) => (
                            <motion.div
                                key={resume.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`relative bg-card border rounded-3xl p-6 shadow-sm transition-all group
                                    ${resume.is_active
                                        ? 'border-emerald-500/50 ring-2 ring-emerald-500/20'
                                        : 'border-border hover:shadow-md hover:border-primary/30'}`}
                            >
                                {/* Active Badge */}
                                {resume.is_active && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full">
                                        <Star className="w-3 h-3 fill-current" />
                                        Active
                                    </div>
                                )}

                                {/* Resume Info */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`p-3.5 rounded-2xl shrink-0 ${resume.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/5 text-primary'}`}>
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base font-bold text-foreground mb-1 truncate pr-16">{resume.filename}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                                                Added {new Date(resume.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                AI Ready
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {/* Set Active Button */}
                                    <button
                                        onClick={() => handleSetActive(resume)}
                                        disabled={resume.is_active || settingActiveId === resume.id}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                                            ${resume.is_active
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default'
                                                : 'bg-muted hover:bg-primary hover:text-white text-foreground active:scale-95'}`}
                                    >
                                        {settingActiveId === resume.id ? (
                                            <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4" />
                                        )}
                                        {resume.is_active ? 'Currently Active' : settingActiveId === resume.id ? 'Setting...' : 'Use This Resume'}
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => setConfirmDelete(resume)}
                                        disabled={deletingId === resume.id}
                                        className="p-2.5 rounded-xl bg-muted hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-all active:scale-95"
                                        title="Delete resume"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Account Section */}
            <div className="mt-20 pt-12 border-t border-border">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Account</h2>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
