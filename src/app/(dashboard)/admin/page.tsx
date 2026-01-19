'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, BarChart3, RotateCw, History, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stats {
    users: { total_users: string; pro_users: string; free_users: string };
    analyses: { total_analyses: string; avg_score: number };
    jobs: { total_jobs: string };
}

export default function AdminPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScraping, setIsScraping] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTriggerScrape = async () => {
        setIsScraping(true);
        try {
            await api.post('/admin/scrape');
            alert('Scraper triggered successfully!');
        } catch (err) {
            console.error(err);
        } finally {
            setIsScraping(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-foreground">Loading Stats...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-foreground mb-2 uppercase tracking-tight">Admin Terminal</h1>
                    <p className="text-muted-foreground font-medium italic">High-level overview of the ChooJobs ecosystem.</p>
                </div>

                <button
                    onClick={handleTriggerScrape}
                    disabled={isScraping}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-primary/20"
                >
                    <RotateCw className={`w-5 h-5 ${isScraping ? 'animate-spin' : ''}`} />
                    {isScraping ? 'Scraping...' : 'Trigger Global Sync'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Users" value={stats?.users.total_users || '0'} icon={Users} color="text-blue-500" />
                <StatCard title="Pro Users" value={stats?.users.pro_users || '0'} icon={ShieldAlert} color="text-indigo-500" />
                <StatCard title="Analyses Run" value={stats?.analyses.total_analyses || '0'} icon={BarChart3} color="text-emerald-500" />
                <StatCard title="Total Jobs" value={stats?.jobs.total_jobs || '0'} icon={History} color="text-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-6">User Composition</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden flex">
                            <div
                                className="bg-primary h-full"
                                style={{ width: `${(Number(stats?.users.pro_users) / Number(stats?.users.total_users)) * 100}%` }}
                            />
                            <div
                                className="bg-muted-foreground/30 h-full"
                                style={{ width: `${(Number(stats?.users.free_users) / Number(stats?.users.total_users)) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm font-medium">
                        <span className="text-primary">Pro Users</span>
                        <span className="text-muted-foreground">Free Users</span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 flex items-center justify-between shadow-sm">
                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Average Match Score</h3>
                        <p className="text-muted-foreground text-sm font-medium mb-4">Quality of all AI-generated analyses.</p>
                        <div className="text-5xl font-black text-foreground">{Math.round(stats?.analyses.avg_score || 0)}%</div>
                    </div>
                    <div className="w-24 h-24 border-8 border-primary/20 border-t-primary rounded-full flex items-center justify-center">
                        <span className="text-primary font-black text-xl">{Math.round(stats?.analyses.avg_score || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 bg-background rounded-2xl ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-muted-foreground font-bold text-sm uppercase tracking-widest">{title}</span>
            </div>
            <div className="text-4xl font-black text-foreground">{value}</div>
        </motion.div>
    );
}
