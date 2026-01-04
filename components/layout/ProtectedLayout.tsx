"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, LogOut, Sparkles, FolderOpen, Activity, Settings, Users } from 'lucide-react';
import { toast } from 'sonner';
import { PanelLeft, PanelLeftClose } from 'lucide-react';
import Cookies from 'js-cookie';
import { MobileBottomNav } from './MobileBottomNav';

interface ProtectedLayoutProps {
    children: React.ReactNode;
    role?: 'ADMIN' | 'CLIENT';
}

interface NavItem {
    name: string;
    href: string;
    icon: any;
    active?: boolean;
}

const RoleSidebar: React.FC<{ role: 'ADMIN' | 'CLIENT' }> = ({ role }) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user_profile');
        router.push('/login');
    };

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
    const panelName = role === 'ADMIN' ? 'Admin Panel' : 'Client Portal';

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
                        <p className="text-xs text-gray-400">{panelName}</p>
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

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children, role = 'CLIENT' }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user_profile');
        router.push('/login');
    };

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
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className={`hidden md:flex ${isSidebarVisible ? '' : 'md:hidden'}`}>
                {isSidebarVisible && <RoleSidebar role={role} />}
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 relative pb-16 md:pb-0 ${isSidebarVisible ? 'md:ml-64' : 'md:ml-0'
                    }`}
            >
                {/* Sidebar Toggle Button - Edge Arrow (Desktop only) */}
                <button
                    onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                    className={`hidden md:block fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-white border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-lg hover:shadow-xl opacity-0 hover:opacity-100 ${isSidebarVisible
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

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav role={role} onLogout={handleLogout} />
        </div>
    );
};
