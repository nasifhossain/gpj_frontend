'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { TemplateList } from '@/components/admin/TemplateList';
import { LoadingSpinner, ErrorAlert } from '@/components/shared/StatusComponents';
import { useTemplates } from '@/hooks/useTemplates';
import { FileText, Sparkles } from 'lucide-react';

export default function ClientTemplatesPage() {
    const router = useRouter();
    const { templates, loading, error } = useTemplates();

    const handleTemplateClick = (template: any) => {
        // Navigate to the brief editing page for this template
        // In a real scenario, you'd create a new brief from template or load an existing one
        // For now, we'll use the template ID as the brief ID
        router.push(`/templates/${template.id}`);
    };

    return (
        <ProtectedLayout role="CLIENT">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Browse and create briefs from available templates
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <ErrorAlert message={error} />
                    ) : templates.length > 0 ? (
                        <div>
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Available Templates
                                        </h2>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Click on a template to start filling your brief
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <span className="font-medium text-gray-700">{templates.length}</span>{' '}
                                        {templates.length === 1 ? 'template' : 'templates'} available
                                    </div>
                                </div>
                            </div>
                            <TemplateList
                                templates={templates}
                                onSelectTemplate={handleTemplateClick}
                            />
                        </div>
                    ) : (
                        // Empty state
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                            <div className="text-center max-w-lg mx-auto">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Sparkles className="w-10 h-10 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    No Templates Available
                                </h3>
                                <p className="text-gray-600 mb-2 leading-relaxed">
                                    There are currently no templates available. Templates will appear here once they are created by administrators.
                                </p>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Check back later or contact your administrator for more information.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedLayout>
    );
}
