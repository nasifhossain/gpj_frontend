"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Activity, Users, LogOut } from 'lucide-react';

interface MobileBottomNavProps {
    role: 'ADMIN' | 'CLIENT';
    onLogout: () => void;
}

interface NavItem {
    name: string;
    href: string;
    icon: any;
    active?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ role, onLogout }) => {
    const pathname = usePathname();
    const router = useRouter();

    // Define navigation items based on role
    const getNavItems = (): NavItem[] => {
        if (role === 'ADMIN') {
            return [
                {
                    name: 'Dashboard',
                    href: '/admin',
                    icon: LayoutDashboard,
                    active: pathname === '/admin',
                },
                {
                    name: 'Templates',
                    href: '/admin/templates',
                    icon: FileText,
                    active: pathname.startsWith('/admin/templates'),
                },
                {
                    name: 'Submissions',
                    href: '/admin/submissions',
                    icon: Activity,
                    active: pathname.startsWith('/admin/submissions'),
                },
                {
                    name: 'Users',
                    href: '/admin/users',
                    icon: Users,
                    active: pathname.startsWith('/admin/users'),
                },
            ];
        } else {
            // CLIENT navigation
            return [
                {
                    name: 'Dashboard',
                    href: '/dashboard',
                    icon: LayoutDashboard,
                    active: pathname === '/dashboard',
                },
                {
                    name: 'Templates',
                    href: '/templates',
                    icon: FileText,
                    active: pathname.startsWith('/templates'),
                },
            ];
        }
    };

    const navItems = getNavItems();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 shadow-2xl">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={`
                                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]
                                ${item.active
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </button>
                    );
                })}

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 min-w-[60px]"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Logout</span>
                </button>
            </div>
        </nav>
    );
};
