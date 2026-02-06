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
    X,
    ChevronRight,
    LogOut,
    CreditCard,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { RiCollapseDiagonalLine } from "react-icons/ri";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { ThemeToggle } from './ThemeToggle';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isCollapsed?: boolean;
    toggleCollapse?: () => void;
}

export default function Sidebar({
    isOpen = false,
    onClose = () => { },
    isCollapsed = false,
    toggleCollapse = () => { }
}: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Browse Jobs', href: '/jobs', icon: Briefcase },
        { name: 'My Resumes', href: '/resumes', icon: FileText },
        { name: 'Subscription', href: '/subscription', icon: CreditCard },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'Admin Panel', href: '/admin', icon: ShieldCheck });
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "bg-card border-r border-border flex flex-col h-screen transition-all duration-300 ease-in-out sticky top-0 z-50",
                // Mobile styles
                "fixed md:sticky top-0 h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                // Desktop collapsed state
                isCollapsed ? "w-20" : "w-64"
            )}>
                {/* Header */}
                <div className={cn("p-6 pb-2", isCollapsed && "p-4 items-center")}>
                    <div className={cn("flex items-center gap-3 mb-6", isCollapsed && "justify-center mb-6")}>
                        <div className="bg-white rounded-lg p-1 shrink-0">
                            <img src="/logo.png" alt="ChooJobs" className="w-12 h-12 object-contain" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex items-center justify-between flex-1">
                                <span className="text-xl font-bold text-foreground tracking-tight">ChooJobs</span>
                                <button onClick={onClose} className="md:hidden text-muted-foreground p-1 hover:bg-muted rounded">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Desktop Collapse Toggle (Above Nav) */}
                    <div className={cn("hidden md:flex mb-2", isCollapsed ? "justify-center" : "justify-end")}>
                        <button
                            onClick={toggleCollapse}
                            className="text-muted-foreground hover:bg-muted p-2 rounded-lg transition-colors border-2 border-transparent hover:border-border"
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            {isCollapsed ?  <TbLayoutSidebarRightCollapseFilled className="w-5 h-5" /> : <RiCollapseDiagonalLine  className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Nav Items (Scrollable) */}
                <div className="flex-1 overflow-y-auto py-2 px-3 scrollbar-hide">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center p-3 rounded-xl transition-all group",
                                        isCollapsed ? "justify-center" : "justify-between",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5 shrink-0" />
                                        {!isCollapsed && <span className="font-medium">{item.name}</span>}
                                    </div>
                                    {!isCollapsed && isActive && <ChevronRight className="w-4 h-4" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer (Pinned to bottom) */}
                <div className="p-4 border-t border-border bg-card">
                    {!isCollapsed ? (
                        <div className="p-4 bg-muted/50 rounded-xl mb-4">
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-1">Plan</p>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground font-bold capitalize text-sm">{user?.plan || 'Free'}</span>
                                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{user?.credits} Credits</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-4">
                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">
                                {user?.credits}
                            </span>
                        </div>
                    )}

                    <div className={cn("mb-2", isCollapsed && "flex justify-center")}>
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={logout}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all",
                            isCollapsed && "justify-center"
                        )}
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>
            </div>
        </>
    );
}
