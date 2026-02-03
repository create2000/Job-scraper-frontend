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
        <div>
            <h1 className="text-2xl font-black mb-6">Saved Jobs</h1>
            {loading ? <p>Loading...</p> : (
                <div className="space-y-4">
                    {saved.length === 0 && <p>No saved jobs yet.</p>}
                    {saved.map(s => (
                        <div key={s.saved_id} className="bg-card border border-border p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <Link href={`/jobs/${s.job_id}`} className="font-bold text-primary">{s.title}</Link>
                                <div className="text-sm text-muted-foreground">{s.company} • Saved {new Date(s.saved_at).toLocaleString()}</div>
                            </div>
                            <div>
                                <button onClick={() => unsave(s.job_id)} className="px-3 py-1 rounded-xl bg-rose-500 text-white">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
