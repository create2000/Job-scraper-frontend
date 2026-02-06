'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import HeaderMobile from '@/components/MobileHeader';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = React.useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="flex min-h-screen bg-background flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden">
                <HeaderMobile onOpenSidebar={() => setIsMobileMenuOpen(true)} />
            </div>

            {/* Sidebar */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                isCollapsed={isDesktopCollapsed}
                toggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 text-foreground transition-all duration-300">
                {children}
            </main>
        </div>
    );
}


