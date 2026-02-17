'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', {
                email,
                password,
                full_name: fullName
            });
            router.push('/login');
        } catch (err: unknown) {
            interface ErrorResponse {
                response?: {
                    data?: {
                        error?: string;
                    };
                };
            }

            const errorObj = err as ErrorResponse;

            if (
                typeof err === 'object' &&
                err !== null &&
                'response' in errorObj &&
                typeof errorObj.response === 'object' &&
                errorObj.response !== null &&
                'data' in errorObj.response &&
                typeof errorObj.response.data === 'object' &&
                errorObj.response.data !== null &&
                'error' in errorObj.response.data &&
                typeof errorObj.response.data.error === 'string'
            ) {
                setError(errorObj.response.data.error as string);
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="bg-card border border-border p-10 rounded-[3rem] shadow-2xl backdrop-blur-sm">
                    <div className="text-center mb-10">
                        <div className="bg-white rounded-2xl p-2 w-fit mx-auto mb-6 shadow-sm border border-border">
                            <img src="/logo.png" alt="Quintly" className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Join the Engine</h1>
                        <p className="text-muted-foreground font-medium">Create your Quintly account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input
                                    type="password"
                                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold p-4 rounded-xl text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Get Started Now'}
                            {!loading && <UserPlus className="w-5 h-5" />}
                        </button>

                        <div className="mt-4">
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/google`}
                                className="w-full inline-flex items-center justify-center gap-3 border border-border bg-background text-foreground py-3 rounded-2xl font-bold hover:bg-gray-50 hover:text-black transition-colors"
                            >
                                <Image src="/google-logo.svg" alt="Google" width={18} height={18} />
                                Sign up with Google
                            </a>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-muted-foreground font-medium italic">Already have an account? </span>
                        <Link href="/login" className="text-primary font-black uppercase tracking-widest text-xs hover:underline underline-offset-4 ml-1">
                            Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
