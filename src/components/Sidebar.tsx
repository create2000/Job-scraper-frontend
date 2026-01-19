'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Briefcase,
    LayoutDashboard,
    FileText,
    ShieldCheck,
    LogOut,
    ChevronRight,
    Sun,
    Moon
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Browse Jobs', href: '/jobs', icon: Briefcase },
        { name: 'My Resumes', href: '/resumes', icon: FileText },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'Admin Panel', href: '/admin', icon: ShieldCheck });
    }

    return (
        <div className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <img src="/logo.png" alt="ChooJobs" className="w-8 h-8 rounded-lg" />
                    <span className="text-xl font-bold text-foreground tracking-tight">ChooJobs</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-border">
                <div className="p-4 bg-muted/50 rounded-xl mb-4">
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-1">Current Plan</p>
                    <div className="flex items-center justify-between">
                        <span className="text-foreground font-bold capitalize">{user?.plan || 'Free'}</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{user?.credits} Credits</span>
                    </div>
                </div>
                <div className="mb-2">
                    <ThemeToggle />
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
