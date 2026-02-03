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
        <div>
            <h1 className="text-2xl font-black mb-6">My Applications</h1>
            {loading ? <p>Loading...</p> : (
                <div className="space-y-4">
                    {applications.length === 0 && <p>No applications yet.</p>}
                    {applications.map(app => (
                        <div key={app.id} className="bg-card border border-border p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <Link href={`/jobs/${app.job_id}`} className="font-bold text-primary">{app.job_title}</Link>
                                <div className="text-sm text-muted-foreground">{app.company} • Applied {new Date(app.applied_at).toLocaleString()}</div>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-xl border text-sm">{app.status}</span>
                                <button onClick={() => withdraw(app.id)} className="px-3 py-1 rounded-xl bg-rose-500 text-white">Withdraw</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
