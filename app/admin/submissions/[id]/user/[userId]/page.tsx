"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { UserSubmissionView } from '@/components/admin/UserSubmissionView';
import { LoadingSpinner, ErrorAlert } from '@/components/shared/StatusComponents';
import { submissionsService } from '@/lib/api/submissions';

export default function UserSubmissionPage() {
    const params = useParams();
    const router = useRouter();
    const templateId = params.id as string;
    const userId = params.userId as string;

    const [submissionData, setSubmissionData] = useState<any>(null);
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch the detailed submission data
                const response = await submissionsService.getUserSubmission(templateId, userId);

                // Extract data from response
                const data = response.data || response;
                setSubmissionData(data);

                // Get user info from the template preview to get name/email
                const templates = await submissionsService.getTemplateSubmissions();
                const template = templates.find(t => t.id === templateId);
                const user = template?.submissions.find(s => s.id === userId);

                if (user) {
                    setUserName(user.name);
                    setUserEmail(user.email);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load submission details');
            } finally {
                setLoading(false);
            }
        };

        if (templateId && userId) {
            fetchSubmission();
        }
    }, [templateId, userId]);

    const handleBack = () => {
        router.push(`/admin/submissions/${templateId}`);
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
                                Back to Submissions
                            </button>
                        </div>
                    ) : submissionData ? (
                        <UserSubmissionView
                            data={submissionData}
                            userName={userName}
                            userEmail={userEmail}
                            onBack={handleBack}
                        />
                    ) : null}
                </div>
            </div>
        </ProtectedLayout>
    );
}
