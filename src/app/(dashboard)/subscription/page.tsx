'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Check, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubscriptionPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const res = await api.post('/payment/initialize', {
                email: user?.email,
                amount: 5000
            });
            window.location.href = res.data.data.authorization_url;
        } catch (err) {
            console.error(err);
            alert('Subscription initialization failed.');
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.plan === 'pro') {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">My Subscription</h1>
                    <p className="text-muted-foreground font-medium">Manage your plan and billing details.</p>
                </div>

                <div className="bg-blue-50/10 dark:bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Star className="w-10 h-10 text-primary fill-primary" />
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4">You are a <span className="text-primary font-black uppercase">Pro</span> Member</h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                        You have unlimited access to AI analysis, resume optimization, and export features. You're set for career success!
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm uppercase tracking-widest border border-primary/20">
                        <Check className="w-4 h-4" />
                        Active Plan
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Upgrade Your Career</h1>
                <p className="text-muted-foreground text-lg font-medium">Choose the plan that fits your career goals and unlocks AI-powered insights.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Free Tier */}
                <div className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">The Candidate</h3>
                        <div className="text-6xl font-extrabold mb-3">Free</div>
                        <p className="text-muted-foreground font-medium">Perfect for basic job hunting and exploring.</p>
                    </div>
                    <ul className="space-y-5 mb-12 flex-1">
                        <li className="flex items-center gap-3 text-sm font-semibold">
                            <div className="p-1 bg-muted rounded-full">
                                <Check className="w-3 h-3 text-muted-foreground" />
                            </div>
                            Access to all scraped jobs
                        </li>
                        <li className="flex items-center gap-3 text-sm font-semibold">
                            <div className="p-1 bg-muted rounded-full">
                                <Check className="w-3 h-3 text-muted-foreground" />
                            </div>
                            5 AI match analyses per month
                        </li>
                        <li className="flex items-center gap-3 text-sm font-semibold text-muted-foreground/40 line-through">
                            <div className="p-1 opacity-40">
                                <Check className="w-3 h-3" />
                            </div>
                            Premium PDF/DOCX Export
                        </li>
                    </ul>
                    <button disabled className="w-full bg-muted text-muted-foreground py-4 rounded-xl font-bold uppercase tracking-widest text-xs cursor-not-allowed">
                        Current Plan
                    </button>
                </div>

                {/* Pro Tier */}
                <div className="bg-card border-2 border-primary p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col shadow-2xl shadow-primary/10">
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-bl-2xl">
                        Recommended
                    </div>

                    <div className="mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">The Engineer</h3>
                        <div className="text-6xl font-extrabold mb-3">₦5,000<span className="text-xl text-muted-foreground font-medium ml-1">/mo</span></div>
                        <p className="text-muted-foreground font-medium">Unlock the full power of AI-driven job search.</p>
                    </div>

                    <ul className="space-y-5 mb-12 flex-1">
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <div className="p-1 bg-primary text-white rounded-full">
                                <Zap className="w-3 h-3" />
                            </div>
                            Unlimited AI match analyses
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <div className="p-1 bg-primary text-white rounded-full">
                                <Check className="w-3 h-3" />
                            </div>
                            Infinite PDF/DOCX Exports
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <div className="p-1 bg-primary text-white rounded-full">
                                <Check className="w-3 h-3" />
                            </div>
                            Priority support & engine updates
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <div className="p-1 bg-primary text-white rounded-full">
                                <Star className="w-3 h-3" />
                            </div>
                            Early access to new features
                        </li>
                    </ul>

                    <button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="w-full bg-primary text-white hover:bg-blue-700 py-5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-70"
                    >
                        {isLoading ? 'Processing...' : 'Upgrade Now'}
                    </button>

                    <p className="text-[10px] text-center mt-6 text-muted-foreground uppercase tracking-widest font-bold">
                        Secure transaction via Paystack
                    </p>
                </div>
            </div>
        </div>
    );
}
