'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, BarChart3, RotateCw, History, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

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
                    <p className="text-muted-foreground font-medium italic">High-level overview of the Quintly ecosystem.</p>
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
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm h-[400px]">
                    <h3 className="text-xl font-bold text-foreground mb-6 uppercase tracking-tight">User Segment distribution</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Pro Users', value: Number(stats?.users.pro_users || 0) },
                                    { name: 'Free Users', value: Number(stats?.users.free_users || 0) }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                <Cell fill="#6366f1" />
                                <Cell fill="#e2e8f0" />
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm h-[400px]">
                    <h3 className="text-xl font-bold text-foreground mb-6 uppercase tracking-tight">Platform Performance</h3>
                    <div className="flex flex-col items-center justify-center h-full pb-10">
                        <div className="text-7xl font-black text-foreground mb-2">{Math.round(stats?.analyses.avg_score || 0)}%</div>
                        <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">Average Match Score</p>

                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats?.analyses.avg_score || 0}%` }}
                                className="h-full bg-primary"
                            />
                        </div>
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
