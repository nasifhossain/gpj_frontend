import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

interface FieldValue {
    id: string;
    fieldId: string;
    value: any;
    source: 'AI' | 'MANUAL';
    confidence?: number;
    modelUsed?: string;
    updatedAt: string;
}

interface Field {
    id: string;
    fieldKey: string;
    label: string;
    fieldHeading: string;
    dataType: 'String' | 'Date' | 'Array' | 'Object';
    fieldType: 'input' | 'dropdown' | 'textarea';
    options: any;
    prompt: string | null;
    values: FieldValue[];
}

interface Section {
    id: string;
    sectionName: string;
    orderIndex: number;
    fields: Field[];
}

interface UserSubmissionData {
    id: string;
    title: string;
    templateName: string;
    status: string;
    sections: Section[];
}

interface UserSubmissionViewProps {
    data: UserSubmissionData;
    userName: string;
    userEmail: string;
    onBack: () => void;
}

const FieldValueDisplay: React.FC<{ field: Field }> = ({ field }) => {
    const latestValue = field.values && field.values.length > 0 ? field.values[0] : null;

    const renderValue = () => {
        if (!latestValue) {
            return <span className="text-gray-400 italic">No value provided</span>;
        }

        const { value, source, confidence } = latestValue;

        // Handle different data types
        if (field.dataType === 'Array') {
            return (
                <div className="space-y-2">
                    <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
                </div>
            );
        }

        if (field.dataType === 'Object') {
            try {
                const objValue = typeof value === 'string' ? JSON.parse(value) : value;
                return (
                    <div className="space-y-1">
                        {Object.entries(objValue).map(([key, val]) => (
                            <div key={key} className="flex gap-2">
                                <span className="font-medium text-gray-700">{key}:</span>
                                <span className="text-gray-800">{String(val)}</span>
                            </div>
                        ))}
                    </div>
                );
            } catch {
                return <span className="text-gray-800">{String(value)}</span>;
            }
        }

        return <span className="text-gray-800">{String(value)}</span>;
    };

    const getConfidenceColor = (conf?: number) => {
        if (!conf) return 'text-gray-500';
        if (conf >= 0.8) return 'text-green-600';
        if (conf >= 0.5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getConfidenceBadge = (conf?: number) => {
        if (!conf) return null;
        if (conf >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
        if (conf >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {renderValue()}
                </div>
                {latestValue && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {latestValue.source === 'AI' ? (
                            <>
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <span className={`text-xs px-2 py-1 rounded-full border ${getConfidenceBadge(latestValue.confidence)}`}>
                                    {latestValue.confidence ? `${Math.round(latestValue.confidence * 100)}% confidence` : 'AI Generated'}
                                </span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                    Manual Entry
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export const UserSubmissionView: React.FC<UserSubmissionViewProps> = ({
    data,
    userName,
    userEmail,
    onBack
}) => {
    const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

    // Group fields by heading
    const groupFieldsByHeading = (fields: Field[]) => {
        const grouped: Record<string, Field[]> = {};
        fields.forEach(field => {
            if (!grouped[field.fieldHeading]) {
                grouped[field.fieldHeading] = [];
            }
            grouped[field.fieldHeading].push(field);
        });
        return grouped;
    };

    const handleDownloadPDF = async () => {
        try {
            setIsGeneratingPDF(true);

            // Dynamically import the PDF generator to avoid SSR issues
            const { generateAndPreviewBriefPDF } = await import('@/lib/utils/pdfGenerator');

            // Convert the submission data to Brief format for PDF generation
            const briefData: any = {
                id: data.id,
                title: data.title,
                templateName: data.templateName,
                status: data.status,
                createdById: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: {
                    id: '',
                    name: userName,
                    email: userEmail,
                    role: 'CLIENT',
                },
                sections: data.sections.map(section => ({
                    ...section,
                    briefId: data.id,
                    fields: section.fields.map(field => ({
                        ...field,
                        sectionId: section.id,
                        value: field.values && field.values.length > 0 ? field.values[0] : null,
                    })),
                })),
            };

            await generateAndPreviewBriefPDF(briefData);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGeneratingPDF ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View PDF
                        </>
                    )}
                </button>
            </div>

            {/* User Info Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">{userName}'s Submission</h2>
                        <p className="text-emerald-100 mb-3">{userEmail}</p>
                        <div className="flex flex-wrap gap-3 text-sm">
                            <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg">
                                <span className="font-medium">Template:</span> {data.templateName}
                            </div>
                            <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg">
                                <span className="font-medium">Status:</span> {data.status}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections */}
            {data.sections.map((section, sectionIndex) => {
                const groupedFields = groupFieldsByHeading(section.fields);

                return (
                    <div key={section.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        {/* Section Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">{section.sectionName}</h3>
                        </div>

                        {/* Field Groups */}
                        <div className="p-6 space-y-8">
                            {Object.entries(groupedFields).map(([heading, fields]) => (
                                <div key={heading}>
                                    {/* Heading */}
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-emerald-200">
                                        {heading}
                                    </h4>

                                    {/* Fields */}
                                    <div className="space-y-6">
                                        {fields.map((field) => (
                                            <div key={field.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <label className="text-sm font-semibold text-gray-700">
                                                        {field.label}
                                                    </label>
                                                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                                                        {field.dataType}
                                                    </span>
                                                </div>
                                                <FieldValueDisplay field={field} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Summary Stats */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-blue-600 font-medium mb-1">Total Sections</p>
                        <p className="text-2xl font-bold text-blue-900">{data.sections.length}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-purple-600 font-medium mb-1">Total Fields</p>
                        <p className="text-2xl font-bold text-purple-900">
                            {data.sections.reduce((sum, s) => sum + s.fields.length, 0)}
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-green-600 font-medium mb-1">Filled Fields</p>
                        <p className="text-2xl font-bold text-green-900">
                            {data.sections.reduce((sum, s) =>
                                sum + s.fields.filter(f => f.values && f.values.length > 0).length, 0
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
