"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { SubmissionDetail } from '@/components/admin/SubmissionDetail';
import { LoadingSpinner, ErrorAlert } from '@/components/shared/StatusComponents';
import { submissionsService } from '@/lib/api/submissions';
import { TemplateSubmission } from '@/lib/types/brief';

export default function SubmissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const templateId = params.id as string;

    const [template, setTemplate] = useState<TemplateSubmission | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await submissionsService.getTemplateSubmissionById(templateId);
                setTemplate(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load template details');
            } finally {
                setLoading(false);
            }
        };

        if (templateId) {
            fetchTemplate();
        }
    }, [templateId]);

    const handleBack = () => {
        router.push('/admin/submissions');
    };

    return (
        <ProtectedLayout role="ADMIN">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="space-y-4">
                            <ErrorAlert message={error} />
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Back to List
                            </button>
                        </div>
                    ) : template ? (
                        <SubmissionDetail template={template} onBack={handleBack} />
                    ) : null}
                </div>
            </div>
        </ProtectedLayout>
    );
}
