"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { TemplateList } from '@/components/admin/TemplateList';
import { TemplateDetail } from '@/components/admin/TemplateDetail';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { LoadingSpinner, ErrorAlert } from '@/components/shared/StatusComponents';
import { useTemplates } from '@/hooks/useTemplates';
import { Plus } from 'lucide-react';

export default function AdminPage() {
    const router = useRouter();
    const { templates, selectedTemplate, loading, error, setSelectedTemplate } = useTemplates();

    return (
        <ProtectedLayout role="ADMIN">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Slim Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
                            {selectedTemplate && (
                                <p className="text-sm text-gray-500 mt-1">Viewing: {selectedTemplate.templateName}</p>
                            )}
                        </div>
                        {!selectedTemplate && (
                            <button
                                onClick={() => router.push('/admin/templates/create')}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                            >
                                <Plus className="w-5 h-5" />
                                Create Template
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <ErrorAlert message={error} />
                    ) : selectedTemplate ? (
                        <TemplateDetail
                            template={selectedTemplate}
                            onBack={() => setSelectedTemplate(null)}
                        />
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Available Templates</h2>
                                <p className="text-gray-600 text-sm">Select a template to view its structure and fields.</p>
                            </div>
                            <TemplateList
                                templates={templates}
                                onSelectTemplate={setSelectedTemplate}
                            />
                        </div>
                    )}
                </div>
            </div>
        </ProtectedLayout>
    );
}
