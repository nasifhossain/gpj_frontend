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
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg">
                    <span className="text-3xl">📝</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Let's create your template</h2>
                <p className="text-lg text-gray-600">Start by giving your template a name and title</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 space-y-6">
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
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white text-lg">💡</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-emerald-900 mb-1.5">Pro Tip</h4>
                            <p className="text-sm text-emerald-800 leading-relaxed">
                                Choose a descriptive name that makes it easy to identify this template later. You'll be able to add sections and fields in the next steps.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
