'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
    onOpenSidebar: () => void;
}

export default function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <div className="bg-white rounded p-1">
                    <img src="/logo.png" alt="ChooJobs" className="w-6 h-6 object-contain" />
                </div>
                <span className="font-bold text-lg tracking-tight">ChooJobs</span>
            </div>

            <button
                onClick={onOpenSidebar}
                className="p-2 -mr-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>
    );
}
