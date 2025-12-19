import React from 'react';
import { Template } from '@/lib/types';
import { CheckCircle2, Edit2, FileText } from 'lucide-react';

interface ReviewStepProps {
    template: Template;
    onEdit: (sectionIndex: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ template, onEdit }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Template</h2>
                <p className="text-gray-600">Make sure everything looks good before creating</p>
            </div>

            <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                                Template Name
                            </label>
                            <p className="text-sm font-medium text-gray-900">{template.templateName}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                            <p className="text-sm font-medium text-gray-900">{template.title}</p>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {template.sections.map((section, sIndex) => (
                        <div
                            key={sIndex}
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 flex items-center justify-between border-b border-emerald-200">
                                <h4 className="text-lg font-semibold text-emerald-900">
                                    {section.sectionName || `Section ${sIndex + 1}`}
                                </h4>
                                <button
                                    onClick={() => onEdit(sIndex)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-white rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {section.inputFields.map((group, gIndex) => (
                                    <div key={gIndex} className="border-l-4 border-indigo-500 pl-4">
                                        <h5 className="text-sm font-semibold text-gray-900 mb-2">
                                            {group.fieldsHeading || `Field Group ${gIndex + 1}`}
                                        </h5>
                                        <div className="space-y-2">
                                            {group.fields.map((field, fIndex) => (
                                                <div
                                                    key={fIndex}
                                                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                                                >
                                                    <span className="text-sm text-gray-900 font-medium">
                                                        {field.inputName || `Field ${fIndex + 1}`}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="px-2 py-1 bg-white rounded border border-gray-200">
                                                            {field.dataType}
                                                        </span>
                                                        <span className="px-2 py-1 bg-white rounded border border-gray-200">
                                                            {field.fieldType}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {section.inputFields.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No field groups added</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {template.sections.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <p className="text-gray-600">No sections added yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};
