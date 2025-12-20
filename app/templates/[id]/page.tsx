'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { LoadingSpinner, ErrorAlert } from '@/components/shared/StatusComponents';
import { FieldInput } from '@/components/brief/FieldInput';
import { FileUpload } from '@/components/brief/FileUpload';
import { briefService } from '@/lib/api';
import { Brief, BriefField } from '@/lib/types/brief';
import { ArrowLeft, Save, FileText, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function BriefEditPage() {
    const params = useParams();
    const router = useRouter();
    const briefId = params.id as string;

    const [brief, setBrief] = useState<Brief | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
    const [saving, setSaving] = useState<Set<string>>(new Set());
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [uploadedS3Keys, setUploadedS3Keys] = useState<Record<string, string[]>>({});

    useEffect(() => {
        loadBrief();
    }, [briefId]);

    const loadBrief = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await briefService.getBrief(briefId);
            setBrief(data);

            // Initialize field values from existing data
            const initialValues: Record<string, any> = {};
            data.sections.forEach(section => {
                section.fields.forEach(field => {
                    if (field.value?.value !== null && field.value?.value !== undefined) {
                        initialValues[field.id] = field.value.value;
                    }
                });
            });
            setFieldValues(initialValues);
        } catch (err: any) {
            setError(err.message || 'Failed to load brief');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = async (field: BriefField, value: any) => {
        // Update local state immediately
        setFieldValues(prev => ({ ...prev, [field.id]: value }));

        // Mark as saving
        setSaving(prev => new Set(prev).add(field.id));

        try {
            await briefService.updateFieldValue(briefId, field.id, value);
            toast.success('Field updated successfully', {
                description: field.label,
            });
        } catch (err: any) {
            toast.error('Failed to update field', {
                description: err.message,
            });
            // Revert on error
            setFieldValues(prev => {
                const newValues = { ...prev };
                delete newValues[field.id];
                return newValues;
            });
        } finally {
            setSaving(prev => {
                const newSaving = new Set(prev);
                newSaving.delete(field.id);
                return newSaving;
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        <FileText className="w-3.5 h-3.5" />
                        Draft
                    </span>
                );
            case 'IN_PROGRESS':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        <Clock className="w-3.5 h-3.5" />
                        In Progress
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        <FileText className="w-3.5 h-3.5" />
                        Draft
                    </span>
                );
        }
    };

    // Group fields by fieldHeading
    const groupFieldsByHeading = (fields: BriefField[]) => {
        const groups: Record<string, BriefField[]> = {};
        fields.forEach(field => {
            const heading = field.fieldHeading || 'Other';
            if (!groups[heading]) {
                groups[heading] = [];
            }
            groups[heading].push(field);
        });
        return groups;
    };

    const handleFilesSelected = async (files: File[]) => {
        const activeSection = brief!.sections[activeSectionIndex];
        setUploading(true);

        try {
            const keys: string[] = [];
            for (const file of files) {
                toast.info(`Uploading ${file.name}...`);
                const s3Key = await briefService.uploadFile(briefId, file);
                keys.push(s3Key);
                toast.success(`${file.name} uploaded successfully`);
            }

            // Store S3 keys for this section
            setUploadedS3Keys(prev => ({
                ...prev,
                [activeSection.id]: [...(prev[activeSection.id] || []), ...keys],
            }));

            toast.success(`All ${files.length} file(s) uploaded successfully!`);
        } catch (err: any) {
            toast.error('Failed to upload files', {
                description: err.message,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleGenerateWithAI = async () => {
        const activeSection = brief!.sections[activeSectionIndex];
        const sectionS3Keys = uploadedS3Keys[activeSection.id] || [];

        if (sectionS3Keys.length === 0) {
            toast.error('No documents uploaded', {
                description: 'Please upload documents first before generating with AI',
            });
            return;
        }

        setGenerating(true);

        try {
            toast.info('Generating field values with AI...');

            const response = await briefService.generateSectionValues({
                sectionId: activeSection.id,
                s3Keys: sectionS3Keys,
            });

            // Update field values from AI response
            if (response.data && response.data.extractedData) {
                const newValues: Record<string, any> = {};
                Object.entries(response.data.extractedData).forEach(([key, value]) => {
                    // Find the field with this fieldKey
                    const field = activeSection.fields.find(f => f.fieldKey === key);
                    if (field) {
                        newValues[field.id] = value;
                    }
                });
                setFieldValues(prev => ({ ...prev, ...newValues }));
            }

            toast.success('AI generation completed!', {
                description: `Generated values for ${response.data?.saveResults?.updated || 0} fields`,
            });

            // Reload the brief to get updated values
            await loadBrief();
        } catch (err: any) {
            toast.error('Failed to generate with AI', {
                description: err.message,
            });
        } finally {
            setGenerating(false);
        }
    };


    if (loading) {
        return (
            <ProtectedLayout role="CLIENT">
                <LoadingSpinner />
            </ProtectedLayout>
        );
    }

    if (error || !brief) {
        return (
            <ProtectedLayout role="CLIENT">
                <div className="p-8">
                    <ErrorAlert message={error || 'Brief not found'} />
                    <button
                        onClick={() => router.push('/templates')}
                        className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Back to Templates
                    </button>
                </div>
            </ProtectedLayout>
        );
    }

    const activeSection = brief.sections[activeSectionIndex];
    const fieldGroups = groupFieldsByHeading(activeSection.fields);

    return (
        <ProtectedLayout role="CLIENT">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.push('/templates')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Back to templates"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{brief.title}</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Template: {brief.templateName}
                                    </p>
                                </div>
                            </div>
                            {getStatusBadge(brief.status)}
                        </div>
                    </div>
                </header>

                {/* Section Tabs */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex gap-2 overflow-x-auto py-3">
                            {brief.sections.map((section, index) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSectionIndex(index)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeSectionIndex === index
                                        ? 'bg-emerald-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {section.sectionName}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{activeSection.sectionName}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Section {activeSectionIndex + 1} of {brief.sections.length}
                            </p>
                        </div>

                        {/* File Upload and AI Generation */}
                        <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-emerald-600" />
                                        AI-Powered Section Fill
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Upload documents and let AI fill this section automatically
                                    </p>
                                </div>
                                <button
                                    onClick={handleGenerateWithAI}
                                    disabled={generating || uploading || (uploadedS3Keys[activeSection.id]?.length || 0) === 0}
                                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                                >
                                    {generating ? (
                                        <>
                                            <Save className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Generate with AI
                                        </>
                                    )}
                                </button>
                            </div>
                            <FileUpload
                                onFilesSelected={handleFilesSelected}
                                uploading={uploading}
                                uploadedFiles={brief.documents?.map(doc => ({
                                    name: doc.fileName,
                                    s3Key: doc.s3Key,
                                })) || []}
                            />
                        </div>

                        {/* Field Groups */}
                        <div className="space-y-8">
                            {Object.entries(fieldGroups).map(([heading, fields]) => (
                                <div key={heading} className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                                        {heading}
                                    </h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {fields.map((field) => (
                                            <div
                                                key={field.id}
                                                className={field.fieldType === 'textarea' ? 'lg:col-span-2' : ''}
                                            >
                                                <FieldInput
                                                    field={field}
                                                    value={fieldValues[field.id]}
                                                    onChange={(value) => handleFieldChange(field, value)}
                                                    disabled={saving.has(field.id)}
                                                />
                                                {saving.has(field.id) && (
                                                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                                        <Save className="w-3 h-3 animate-pulse" />
                                                        Saving...
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setActiveSectionIndex(prev => Math.max(0, prev - 1))}
                                disabled={activeSectionIndex === 0}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous Section
                            </button>
                            <button
                                onClick={() => setActiveSectionIndex(prev => Math.min(brief.sections.length - 1, prev + 1))}
                                disabled={activeSectionIndex === brief.sections.length - 1}
                                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                Next Section
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedLayout>
    );
}
