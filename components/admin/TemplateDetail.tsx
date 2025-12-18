import React, { useState } from 'react';
import { Template, Section, InputField } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

interface TemplateDetailProps {
    template: Template;
    onBack: () => void;
}

const FieldRenderer = ({ field }: { field: InputField }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.inputName} <span className="text-xs text-gray-400">({field.dataType})</span>
            </label>

            {field.prompt && (
                <p className="text-xs text-gray-500 mb-2 italic bg-gray-50 p-2 rounded">{field.prompt}</p>
            )}

            {field.fieldType === 'dropdown' ? (
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border" disabled>
                    <option>Select...</option>
                    {field.options?.map((opt, idx) => (
                        <option key={idx}>{typeof opt === 'string' ? opt : JSON.stringify(opt)}</option>
                    ))}
                </select>
            ) : field.fieldType === 'textarea' || field.dataType === 'Array' ? (
                <textarea
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                    rows={3}
                    disabled
                    placeholder={field.helperText ? field.helperText.join(', ') : ''}
                />
            ) : (
                <input
                    type="text"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                    disabled
                    placeholder={field.inputName}
                />
            )}

            {field.helperText && field.helperText.length > 0 && (
                <div className="mt-1">
                    {field.helperText.map((text, idx) => (
                        <p key={idx} className="text-xs text-gray-500">{text}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export const TemplateDetail: React.FC<TemplateDetailProps> = ({ template, onBack }) => {
    const [activeSection, setActiveSection] = useState<string | null>(template.sections[0]?.sectionName || null);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        className="mr-4 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{template.title}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{template.templateName}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Sidebar for Sections */}
                <div className="w-full md:w-1/4 border-r border-gray-200 bg-gray-50">
                    <nav className="flex flex-col">
                        {template.sections.map((section, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveSection(section.sectionName)}
                                className={`text-left px-4 py-3 text-sm font-medium border-l-4 hover:bg-gray-100 ${activeSection === section.sectionName
                                    ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {section.sectionName}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="w-full md:w-3/4 p-6">
                    {template.sections.map((section, idx) => (
                        <div key={idx} className={activeSection === section.sectionName ? 'block' : 'hidden'}>
                            <h4 className="text-lg font-bold text-gray-900 mb-4">{section.sectionName}</h4>

                            {section.inputFields.map((group, gIdx) => (
                                <div key={gIdx} className="mb-8">
                                    {group.fieldsHeading && group.fieldsHeading !== section.sectionName && (
                                        <h5 className="text-md font-semibold text-gray-700 mb-3 border-b pb-1">{group.fieldsHeading}</h5>
                                    )}

                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        {group.fields.map((field, fIdx) => (
                                            <FieldRenderer key={fIdx} field={field} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
