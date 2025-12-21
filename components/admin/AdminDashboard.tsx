"use client";

import React, { useState, useEffect } from 'react';
import { submissionsService } from '@/lib/api/submissions';
import { TemplateSubmission } from '@/lib/types/brief';
import {
    FileText,
    Users,
    TrendingUp,
    Activity,
    Layers,
    CheckCircle,
    Clock
} from 'lucide-react';

interface DashboardStats {
    totalTemplates: number;
    totalSubmissions: number;
    templatesWithSubmissions: number;
    averageSubmissionsPerTemplate: number;
    recentSubmissions: Array<{
        templateName: string;
        userName: string;
        userEmail: string;
    }>;
}

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Get user profile
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
            setUser(JSON.parse(userProfile));
        }

        // Fetch dashboard data
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const templates = await submissionsService.getTemplateSubmissions();

                // Calculate stats
                const totalTemplates = templates.length;
                const totalSubmissions = templates.reduce((sum, t) => sum + t.submissions.length, 0);
                const templatesWithSubmissions = templates.filter(t => t.submissions.length > 0).length;
                const averageSubmissionsPerTemplate = totalTemplates > 0
                    ? Math.round((totalSubmissions / totalTemplates) * 10) / 10
                    : 0;

                // Get recent submissions (last 5)
                const recentSubmissions: Array<{
                    templateName: string;
                    userName: string;
                    userEmail: string;
                }> = [];

                templates.forEach(template => {
                    template.submissions.forEach(submission => {
                        recentSubmissions.push({
                            templateName: template.templateName,
                            userName: submission.name,
                            userEmail: submission.email,
                        });
                    });
                });

                // Sort by most recent (we'll just take the last 5 for now)
                const recent = recentSubmissions.slice(-5).reverse();

                setStats({
                    totalTemplates,
                    totalSubmissions,
                    templatesWithSubmissions,
                    averageSubmissionsPerTemplate,
                    recentSubmissions: recent,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-800">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            {user && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Welcome back, <span className="font-medium text-gray-700">{user.name}</span>
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Current Role</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                    {user?.role || 'ADMIN'}
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
                    {/* Total Templates */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">TOTAL</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalTemplates || 0}</p>
                        <p className="text-sm text-gray-600">Templates</p>
                    </div>

                    {/* Total Submissions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">TOTAL</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalSubmissions || 0}</p>
                        <p className="text-sm text-gray-600">Submissions</p>
                    </div>

                    {/* Active Templates */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">ACTIVE</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.templatesWithSubmissions || 0}</p>
                        <p className="text-sm text-gray-600">With Submissions</p>
                    </div>

                    {/* Average */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">AVERAGE</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.averageSubmissionsPerTemplate || 0}</p>
                        <p className="text-sm text-gray-600">Per Template</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Submissions</h2>
                            <Activity className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                                stats.recentSubmissions.map((submission, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-semibold text-emerald-700">
                                                {submission.userName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{submission.userName}</p>
                                            <p className="text-xs text-gray-500 truncate">{submission.userEmail}</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Submitted to <span className="font-medium">{submission.templateName}</span>
                                            </p>
                                        </div>
                                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Activity className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">No recent submissions</h3>
                                    <p className="text-sm text-gray-500">Submissions will appear here once users start submitting</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="space-y-3">
                            <a
                                href="/admin/templates/create"
                                className="block w-full text-left px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Create Template</p>
                                        <p className="text-xs text-gray-500">Build a new template</p>
                                    </div>
                                </div>
                            </a>

                            <a
                                href="/admin/templates"
                                className="block w-full text-left px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                                        <Layers className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Manage Templates</p>
                                        <p className="text-xs text-gray-500">View all templates</p>
                                    </div>
                                </div>
                            </a>

                            <a
                                href="/admin/submissions"
                                className="block w-full text-left px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                                        <Users className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">View Submissions</p>
                                        <p className="text-xs text-gray-500">See all user submissions</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* System Info */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">System Overview</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Templates</span>
                                    <span className="text-xs font-medium text-gray-900">{stats?.totalTemplates || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Submissions</span>
                                    <span className="text-xs font-medium text-gray-900">{stats?.totalSubmissions || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Avg. Rate</span>
                                    <span className="text-xs font-medium text-gray-900">{stats?.averageSubmissionsPerTemplate || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-sm p-8 text-white">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-bold mb-2">Admin Control Center</h2>
                        <p className="text-emerald-50 mb-6">
                            Manage templates, view submissions, and monitor system activity all in one place.
                            Use the sidebar to navigate between different sections.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="/admin/templates/create"
                                className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
                            >
                                Create Template
                            </a>
                            <a
                                href="/admin/submissions"
                                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors border border-emerald-400"
                            >
                                View All Submissions
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
