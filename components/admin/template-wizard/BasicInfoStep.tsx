import React from 'react';

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
    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's create your template</h2>
                <p className="text-gray-600">Start by giving your template a name and title</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
                {/* Template Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Template Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={templateName}
                        onChange={(e) => onTemplateNameChange(e.target.value)}
                        className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-gray-400 ${errors.templateName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., Default Template-1"
                    />
                    {errors.templateName && (
                        <p className="mt-2 text-sm text-red-600 font-medium">{errors.templateName}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                        A unique identifier for this template (e.g., "IBM-Event-2025")
                    </p>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Template Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-gray-400 ${errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., IBM Event Assessment Brief 2025"
                    />
                    {errors.title && (
                        <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                        The display name that users will see (e.g., "IBM Event Assessment Brief 2025")
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">💡</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-emerald-900 mb-1">Tip</h4>
                            <p className="text-sm text-emerald-700">
                                Choose a descriptive name that makes it easy to identify this template later. You'll be able to add sections and fields in the next steps.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
