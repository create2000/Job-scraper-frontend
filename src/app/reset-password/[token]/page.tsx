'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Lock, CheckCircle } from 'lucide-react';

// Force dynamic rendering for this page since it uses dynamic params
export const dynamic = 'force-dynamic';

function ResetPasswordContent() {
    const params = useParams();
    const token = params?.token as string;
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        // Validation
        if (!password || !confirmPassword) {
            setMessage('Both password fields are required');
            setStatus('error');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            setStatus('error');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setStatus('error');
            return;
        }

        setStatus('loading');

        try {
            await api.post(`/auth/reset-password/${token}`, { newPassword: password });
            setStatus('success');
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: unknown) {
            setStatus('error');
            const errorMessage = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to reset password. Link may have expired.';
            setMessage(errorMessage);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
                <div className="bg-card border border-border p-8 rounded-2xl text-center max-w-md">
                    <p className="text-destructive font-bold">Invalid reset link</p>
                    <Link href="/login" className="text-primary font-bold mt-4 block">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors mb-8 font-bold text-sm">
                    ← Back to Login
                </Link>

                <div className="bg-card border border-border p-8 rounded-2xl">
                    <div className="text-center mb-8">
                        <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h1 className="text-2xl font-black uppercase">Reset Password</h1>
                        <p className="text-muted-foreground text-sm mt-2">Enter your new password below</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center space-y-4">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                            <p className="font-bold text-green-600">{message}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 block">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 block">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-background border border-border rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                />
                            </div>

                            {message && (
                                <div className={`text-sm text-center font-bold p-3 rounded-lg ${
                                    status === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-3 rounded-2xl transition-all disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
                <div className="bg-card border border-border p-8 rounded-2xl text-center">
                    <p className="font-bold">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
