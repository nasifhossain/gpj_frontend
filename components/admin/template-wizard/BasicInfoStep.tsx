import React, { useState } from 'react';
import { Sparkles, Info, FileText, Eye, HelpCircle } from 'lucide-react';

interface BasicInfoStepProps {
    templateName: string;
    title: string;
    onTemplateNameChange: (value: string) => void;
    onTitleChange: (value: string) => void;
    errors: { templateName?: string; title?: string };
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
    templateName,
    title,
    onTemplateNameChange,
    onTitleChange,
    errors,
}) => {
    const [showContextPanel, setShowContextPanel] = useState(true);

    return (
        <div className="max-w-4xl mx-auto px-6">
            {/* Hero Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Create a New Template
                </h1>
                <p className="text-base text-gray-600 max-w-2xl mx-auto">
                    Build reusable forms for client briefs with custom sections and fields
                </p>
            </div>

            {/* Context Panel */}
            {showContextPanel && (
                <div className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 relative">
                    <button
                        onClick={() => setShowContextPanel(false)}
                        className="absolute top-3 right-3 text-emerald-400 hover:text-emerald-600 transition-colors"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-emerald-900 text-sm mb-1">
                                What is a template?
                            </h3>
                            <p className="text-sm text-emerald-700 leading-relaxed">
                                This template defines the structure of briefs your clients will fill.
                                You'll add sections, fields, and customize the form in the next steps.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                {/* Template Name */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Template Name
                        <span className="text-red-500">*</span>
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
                                <div className="font-semibold mb-1">🧩 Internal identifier</div>
                                <div className="text-gray-300">
                                    Used internally for organization. Use a naming convention like "IBM-Event-2025"
                                </div>
                            </div>
                        </div>
                    </label>
                    <input
                        type="text"
                        value={templateName}
                        onChange={(e) => onTemplateNameChange(e.target.value)}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-900 bg-white transition-all placeholder:text-gray-400 ${errors.templateName
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                            }`}
                        placeholder="e.g., client-event-brief-2025"
                    />
                    {errors.templateName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span className="font-medium">⚠</span> {errors.templateName}
                        </p>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Template Title */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        Template Title
                        <span className="text-red-500">*</span>
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
                                <div className="font-semibold mb-1">👁 Client-facing name</div>
                                <div className="text-gray-300">
                                    This is what clients will see. Make it clear and descriptive.
                                </div>
                            </div>
                        </div>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm text-gray-900 bg-white transition-all placeholder:text-gray-400 ${errors.title
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                            }`}
                        placeholder="e.g., Event Planning Brief"
                    />
                    {errors.title && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <span className="font-medium">⚠</span> {errors.title}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
