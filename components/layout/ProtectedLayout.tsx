"use client";

import React from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 overflow-auto bg-gray-50">
                {children}
            </div>
        </div>
    );
};
