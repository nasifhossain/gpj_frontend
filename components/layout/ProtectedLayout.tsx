"use client";

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { toast } from 'sonner';
import { PanelLeft, PanelLeftClose } from 'lucide-react';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+B (Mac) or Ctrl+B (Windows) - Toggle sidebar
            if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault();
                setIsSidebarVisible(prev => {
                    const newState = !prev;
                    toast.success(newState ? 'Sidebar shown' : 'Sidebar hidden', {
                        description: 'Press ⌘B to toggle',
                    });
                    return newState;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            {isSidebarVisible && <AppSidebar />}

            {/* Main Content */}
            <div
                className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 relative ${isSidebarVisible ? 'ml-64' : 'ml-0'
                    }`}
            >
                {/* Sidebar Toggle Button - Edge Arrow */}
                <button
                    onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                    className={`fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-white border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-lg hover:shadow-xl opacity-0 hover:opacity-100 ${isSidebarVisible
                            ? 'left-64 rounded-r-lg -ml-px'
                            : 'left-0 rounded-r-lg'
                        }`}
                    title={`${isSidebarVisible ? 'Hide' : 'Show'} sidebar (⌘B)`}
                >
                    {isSidebarVisible ? (
                        <PanelLeftClose className="w-4 h-4 text-emerald-700" />
                    ) : (
                        <PanelLeft className="w-4 h-4 text-emerald-700" />
                    )}
                </button>

                {children}
            </div>
        </div>
    );
};
