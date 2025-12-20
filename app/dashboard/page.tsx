'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { FolderOpen, FileText, Activity, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function ClientDashboard() {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Get user profile from localStorage
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
            setUser(JSON.parse(userProfile));
        }
    }, []);

    return (
        <ProtectedLayout role="CLIENT">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Dashboard
                                </h1>
                                {user && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Welcome back, <span className="font-medium text-gray-700">{user.name}</span>
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Current Role</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        {user?.role || 'CLIENT'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Stat Card 1 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FolderOpen className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">TOTAL</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
                            <p className="text-sm text-gray-600">Projects</p>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">AVAILABLE</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
                            <p className="text-sm text-gray-600">Templates</p>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">COMPLETED</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
                            <p className="text-sm text-gray-600">Tasks</p>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-amber-600" />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">THIS WEEK</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
                            <p className="text-sm text-gray-600">Activities</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                                <Activity className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-4">
                                {/* Empty State */}
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Activity className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">No recent activity</h3>
                                    <p className="text-sm text-gray-500">Your activity will appear here once you start using the platform</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions / Info Panel */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                            <div className="space-y-3">
                                <button className="w-full text-left px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                            <FolderOpen className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">New Project</p>
                                            <p className="text-xs text-gray-500">Create a new project</p>
                                        </div>
                                    </div>
                                </button>

                                <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Browse Templates</p>
                                            <p className="text-xs text-gray-500">View available templates</p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* User Info Card */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Info</h3>
                                {user && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Name</span>
                                            <span className="text-xs font-medium text-gray-900">{user.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Email</span>
                                            <span className="text-xs font-medium text-gray-900 truncate ml-2" title={user.email}>
                                                {user.email.length > 20 ? user.email.substring(0, 20) + '...' : user.email}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Getting Started Section */}
                    <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-sm p-8 text-white">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
                            <p className="text-emerald-50 mb-6">
                                Get started by creating your first project or exploring available templates.
                                We're here to help you streamline your workflow.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-sm">
                                    Get Started
                                </button>
                                <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors border border-emerald-400">
                                    View Documentation
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedLayout>
    );
}
