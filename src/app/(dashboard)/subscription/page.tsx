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
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight mb-2">My Subscription</h1>
                    <p className="text-muted-foreground">Manage your plan and billing details.</p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="w-10 h-10 text-primary fill-primary" />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tight mb-4">You are a <span className="text-primary">Pro</span> Member</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                        You have unlimited access to AI analysis, resume optimization, and export features.
                    </p>
                    <div className="inline-flex gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm uppercase tracking-widest">
                        Active Plan
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tight mb-2">Upgrade Plan</h1>
                <p className="text-muted-foreground">Choose the plan that fits your career goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Free Tier */}
                <div className="bg-card border border-border p-6 md:p-10 rounded-[2.5rem] flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">The Candidate</h3>
                        <div className="text-5xl font-black mb-2">Free</div>
                        <p className="text-muted-foreground text-sm">Forever free for basic job hunting.</p>
                    </div>
                    <ul className="space-y-4 mb-12 flex-1">
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <Check className="w-4 h-4 text-primary" />
                            Access to all scraped jobs
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <Check className="w-4 h-4 text-primary" />
                            5 AI match analyses per month
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium text-muted-foreground/50 line-through">
                            Premium PDF/DOCX Export
                        </li>
                    </ul>
                    <button disabled className="w-full bg-muted text-muted-foreground py-4 rounded-xl font-bold uppercase tracking-widest text-xs cursor-not-allowed">
                        Current Plan
                    </button>
                </div>

                {/* Pro Tier */}
                <div className="bg-card border-2 border-primary p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col shadow-2xl shadow-primary/5">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-xl">
                        Recommended
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">The Engineer</h3>
                        <div className="text-5xl font-black mb-2">₦5,000<span className="text-lg text-muted-foreground font-medium">/mo</span></div>
                        <p className="text-muted-foreground text-sm">Unlock the full power of AI job search.</p>
                    </div>

                    <ul className="space-y-4 mb-12 flex-1">
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <div className="p-1 bg-primary/10 rounded-full">
                                <Zap className="w-3 h-3 text-primary" />
                            </div>
                            Unlimited AI match analyses
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <div className="p-1 bg-primary/10 rounded-full">
                                <Check className="w-3 h-3 text-primary" />
                            </div>
                            Infinite PDF/DOCX Exports
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <div className="p-1 bg-primary/10 rounded-full">
                                <Check className="w-3 h-3 text-primary" />
                            </div>
                            Priority support & updates
                        </li>
                    </ul>

                    <button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? 'Processing...' : 'Upgrade Now'}
                    </button>

                    <p className="text-[10px] text-center mt-4 text-muted-foreground uppercase tracking-wider font-medium">
                        Secure payment via Paystack
                    </p>
                </div>
            </div>
        </div>
    );
}
