"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, LogOut, Sparkles } from 'lucide-react';
import Cookies from 'js-cookie';

export const AppSidebar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user_profile');
        router.push('/login');
    };

    const navItems = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: LayoutDashboard,
            active: pathname === '/admin',
        },
        {
            name: 'Templates',
            href: '/admin/templates/create',
            icon: FileText,
            active: pathname.startsWith('/admin/templates'),
        },
    ];

    return (
        <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">GPJ Assistant</h1>
                        <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${item.active
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium text-sm">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};
