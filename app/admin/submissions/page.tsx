"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { SubmissionsList } from '@/components/admin/SubmissionsList';
import { LoadingSpinner, ErrorAlert } from '@/components/shared/StatusComponents';
import { submissionsService } from '@/lib/api/submissions';
import { TemplateSubmission } from '@/lib/types/brief';
import { FileText } from 'lucide-react';

export default function SubmissionsPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<TemplateSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await submissionsService.getTemplateSubmissions();
                setTemplates(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load submissions');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const handleSelectTemplate = (templateId: string) => {
        router.push(`/admin/submissions/${templateId}`);
    };

    return (
        <ProtectedLayout role="ADMIN">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Template Submissions</h1>
                        </div>
                        <p className="text-gray-600 ml-13">
                            View all template submissions and user details
                        </p>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <ErrorAlert message={error} />
                    ) : (
                        <SubmissionsList
                            templates={templates}
                            onSelectTemplate={handleSelectTemplate}
                        />
                    )}
                </div>
            </div>
        </ProtectedLayout>
    );
}
