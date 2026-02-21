'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Check, Zap, Star, Coins } from 'lucide-react';
import axios from 'axios';

const CREDIT_BUNDLES = [
    {
        id: 'basic',
        name: 'Starter Pack',
        credits: 10,
        priceNGN: 5000,
        priceUSD: 5,
        description: 'Perfect for a quick job search boost.',
        icon: Coins,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        id: 'pro',
        name: 'Career Pro',
        credits: 30,
        priceNGN: 15000,
        priceUSD: 12,
        description: 'The most popular choice for serious seekers.',
        icon: Zap,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        recommended: true
    },
    {
        id: 'elite',
        name: 'Elite Hunter',
        credits: 100,
        priceNGN: 40000,
        priceUSD: 30,
        description: 'Unlimited potential for high-volume applications.',
        icon: Star,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10'
    }
];

export default function SubscriptionPage() {
    const { user } = useAuth();
    const [loadingBundleId, setLoadingBundleId] = useState<string | null>(null);
    const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

    useEffect(() => {
        const detectLocation = async () => {
            try {
                const res = await axios.get('https://ipapi.co/json/');
                if (res.data.country_code !== 'NG') {
                    setCurrency('USD');
                }
            } catch (err) {
                console.error('Location detection failed', err);
            }
        };
        detectLocation();
    }, []);

    const handleSubscribe = async (bundleId: string) => {
        setLoadingBundleId(bundleId);
        try {
            const res = await api.post('/payment/initialize', {
                email: user?.email,
                bundleId,
                currency
            });
            window.location.href = res.data.data.authorization_url;
        } catch (err) {
            console.error(err);
            alert('Payment initialization failed.');
            setLoadingBundleId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Get More Credits</h1>
                    <p className="text-muted-foreground text-lg font-medium">Power your job search with AI analysis. Each analysis costs 1 credit.</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="px-4 py-2 bg-muted rounded-xl text-sm font-bold text-foreground shadow-sm">
                        {currency === 'NGN' ? '₦ NGN' : '$ USD'}
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 mb-12 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Your Current Balance</p>
                    <div className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-yellow-500" />
                        <span className="text-3xl font-black">{user?.credits || 0} Credits</span>
                    </div>
                </div>
                <div className="hidden md:block">
                    <p className="text-xs text-muted-foreground max-w-[200px]">Credits never expire and can be used for any AI features across the platform.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {CREDIT_BUNDLES.map((bundle) => (
                    <div
                        key={bundle.id}
                        className={`bg-card border-2 ${bundle.recommended ? 'border-primary shadow-2xl shadow-primary/10 scale-105' : 'border-border shadow-sm'} p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col transition-all hover:translate-y-[-4px]`}
                    >
                        {bundle.recommended && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-bl-2xl">
                                Recommended
                            </div>
                        )}

                        <div className="mb-8">
                            <div className={`w-12 h-12 ${bundle.bgColor} ${bundle.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <bundle.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">{bundle.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-black">
                                    {currency === 'NGN' ? `₦${bundle.priceNGN.toLocaleString()}` : `$${bundle.priceUSD}`}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">{bundle.description}</p>
                        </div>

                        <div className="bg-muted/30 rounded-2xl p-4 mb-8">
                            <div className="flex items-center justify-between text-sm font-bold">
                                <span>Total Credits</span>
                                <span className={bundle.color}>{bundle.credits}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleSubscribe(bundle.id)}
                            disabled={loadingBundleId === bundle.id}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all active:scale-95 disabled:opacity-70 ${bundle.recommended ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:bg-blue-700' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                        >
                            {loadingBundleId === bundle.id ? 'Processing...' : 'Purchase Now'}
                        </button>
                    </div>
                ))}
            </div>

            <p className="text-center mt-12 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Secure transaction via Paystack • Instant delivery
            </p>
        </div>
    );
}
