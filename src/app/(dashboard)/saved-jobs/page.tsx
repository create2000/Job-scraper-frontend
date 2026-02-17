'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function SavedJobsPage() {
    const [saved, setSaved] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSaved = async () => {
        setLoading(true);
        try {
            const res = await api.get('/saved-jobs');
            setSaved(res.data.savedJobs || res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch saved jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSaved(); }, []);

    const unsave = async (jobId: string) => {
        try {
            await api.delete(`/saved-jobs/jobs/${jobId}/save`);
            fetchSaved();
        } catch (err) {
            console.error(err);
            alert('Failed to remove saved job');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Saved Jobs</h1>
                <p className="text-muted-foreground font-medium">Access your bookmarked opportunities anytime.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card border border-border rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-4">
                    {saved.length === 0 && (
                        <div className="bg-card border border-border rounded-2xl p-12 text-center">
                            <p className="text-muted-foreground font-medium italic">Your bookmarks list is empty. Explore and save some jobs!</p>
                        </div>
                    )}
                    {saved.map(s => (
                        <div key={s.saved_id} className="bg-card border border-border p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                            <div>
                                <Link href={`/jobs/${s.job_id}`} className="font-bold text-xl text-primary hover:text-blue-700 transition-colors">{s.title}</Link>
                                <div className="text-sm text-muted-foreground font-medium mt-1">{s.company} • Saved on {new Date(s.saved_at).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href={`/jobs/${s.job_id}`} className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-sm transition-all">
                                    View Details
                                </Link>
                                <button
                                    onClick={() => unsave(s.job_id)}
                                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold text-sm transition-all active:scale-95"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
