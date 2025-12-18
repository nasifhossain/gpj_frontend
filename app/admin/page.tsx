"use client";

import React, { useEffect, useState } from 'react';
import { fetchTemplates } from '@/lib/api';
import { Template } from '@/lib/types';
import { TemplateList } from '@/components/admin/TemplateList';
import { TemplateDetail } from '@/components/admin/TemplateDetail';

export default function AdminPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const data = await fetchTemplates();
                setTemplates(data);
            } catch (err) {
                setError('Failed to load templates. Please ensure the backend is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTemplates();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    {selectedTemplate && (
                        <span className="text-gray-500 text-sm">Viewing Template Details</span>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-red-400">⚠️</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
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
    );
}
