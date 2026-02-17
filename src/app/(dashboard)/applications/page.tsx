'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/applications');
            setApplications(res.data.applications || res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    const withdraw = async (id: string) => {
        if (!confirm('Withdraw this application?')) return;
        try {
            await api.put(`/applications/${id}/withdraw`);
            fetchApplications();
        } catch (err) {
            console.error(err);
            alert('Failed to withdraw application');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">My Applications</h1>
                <p className="text-muted-foreground font-medium">Keep track of your job application status and history.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card border border-border rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.length === 0 && (
                        <div className="bg-card border border-border rounded-2xl p-12 text-center">
                            <p className="text-muted-foreground font-medium italic">No applications yet. Start applying to land your dream job!</p>
                        </div>
                    )}
                    {applications.map(app => (
                        <div key={app.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                            <div>
                                <Link href={`/jobs/${app.job_id}`} className="font-bold text-xl text-primary hover:text-blue-700 transition-colors">{app.job_title}</Link>
                                <div className="text-sm text-muted-foreground font-medium mt-1">{app.company} • Applied on {new Date(app.applied_at).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded-lg bg-muted text-foreground text-xs font-bold uppercase tracking-wider border border-border">{app.status}</span>
                                <button
                                    onClick={() => withdraw(app.id)}
                                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold text-sm transition-all active:scale-95"
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
