'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setMessage('');
        try {
            await api.post('/auth/forgot-password', { email });
            setStatus('sent');
            setMessage('If that email exists, a reset link was sent.');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Failed to send reset email');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl">
                <h2 className="text-2xl font-black mb-4">Forgot Password</h2>
                <p className="text-sm text-muted-foreground mb-6">Enter your account email and we'll send reset instructions.</p>

                {message && (
                    <div className="mb-4 text-sm text-center text-muted-foreground">{message}</div>
                )}

                {status !== 'sent' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl py-3 px-4 outline-none"
                        />
                        <button type="submit" className="w-full bg-primary text-white font-black py-3 rounded-2xl">
                            {status === 'sending' ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <Link href="/login" className="text-primary font-bold">Back to Sign In</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
