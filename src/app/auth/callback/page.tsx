'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Force dynamic rendering for this page since it uses searchParams
export const dynamic = 'force-dynamic';

function AuthCallbackContent() {
    const search = useSearchParams();
    const token = search?.get('token');
    const router = useRouter();
    const { login } = useAuth();
    const [message, setMessage] = useState('Processing authentication...');

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        // Store token then fetch profile and call login
        localStorage.setItem('token', token);
        api.get('/auth/profile')
            .then((res) => {
                login(token, res.data);
            })
            .catch(() => {
                setMessage('OAuth failed. Redirecting to login...');
                setTimeout(() => router.push('/login?error=oauth_failed'), 1500);
            });
    }, [token, router, login]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-card border border-border p-8 rounded-xl text-center">
                <p className="font-bold">{message}</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-card border border-border p-8 rounded-xl text-center">
                    <p className="font-bold">Loading...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
