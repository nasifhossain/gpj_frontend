"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Template, Section, InputField } from '@/lib/types';
import { templateService } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Sparkles, X } from 'lucide-react';
import { SectionEditorStep } from '@/components/admin/template-wizard/SectionEditorStep';
import { SectionTabsBar } from '@/components/admin/template-wizard/SectionTabsBar';
import { FieldGroupSidebar } from '@/components/admin/template-wizard/FieldGroupSidebar';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

export default function CreateTemplatePage() {
    const router = useRouter();
    const [templateName, setTemplateName] = useState('');
    const [title, setTitle] = useState('');
    const [sections, setSections] = useState<Section[]>([]);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ templateName?: string; title?: string }>({});

    // Section management
    const addSection = () => {
        const newSection: Section = {
            sectionName: '',
            inputFields: [],
        };
        setSections([...sections, newSection]);
        setActiveSectionIndex(sections.length);

        // Toast notification with guidance
        toast.success('Section added!', {
            description: 'Now add field groups to organize your inputs.',
        });
    };

    const removeSection = (index: number) => {
        setSections(sections.filter((_, i) => i !== index));
        if (activeSectionIndex >= sections.length - 1) {
            setActiveSectionIndex(Math.max(0, sections.length - 2));
        }
    };

    const updateSectionName = (index: number, name: string) => {
        const updated = [...sections];
        updated[index].sectionName = name;
        setSections(updated);
    };

    // Field group management
    const addFieldGroup = () => {
        const updated = [...sections];
        updated[activeSectionIndex].inputFields.push({
            fieldsHeading: '',
            fields: [],
        });
        setSections(updated);
        setActiveGroupIndex(updated[activeSectionIndex].inputFields.length - 1);

        // Toast notification with guidance
        toast.success('Field group added!', {
            description: 'Start adding fields to collect data.',
        });
    };

    const removeFieldGroup = (groupIndex: number) => {
        const updated = [...sections];
        updated[activeSectionIndex].inputFields = updated[activeSectionIndex].inputFields.filter(
            (_, i) => i !== groupIndex
        );
        setSections(updated);
    };

    const updateFieldGroupHeading = (groupIndex: number, heading: string) => {
        const updated = [...sections];
        updated[activeSectionIndex].inputFields[groupIndex].fieldsHeading = heading;
        setSections(updated);
    };

    // Field management
    const addField = (groupIndex: number) => {
        const updated = [...sections];
        const newField: InputField = {
            inputName: '',
            inputValue: null,
            dataType: 'String',
            fieldType: 'input',
        };
        updated[activeSectionIndex].inputFields[groupIndex].fields.push(newField);
        setSections(updated);
    };

    const removeField = (groupIndex: number, fieldIndex: number) => {
        const updated = [...sections];
        updated[activeSectionIndex].inputFields[groupIndex].fields = updated[
            activeSectionIndex
        ].inputFields[groupIndex].fields.filter((_, i) => i !== fieldIndex);
        setSections(updated);
    };

    const updateField = (groupIndex: number, fieldIndex: number, updates: Partial<InputField>) => {
        const updated = [...sections];
        updated[activeSectionIndex].inputFields[groupIndex].fields[fieldIndex] = {
            ...updated[activeSectionIndex].inputFields[groupIndex].fields[fieldIndex],
            ...updates,
        };
        setSections(updated);
    };

    // Validation
    const validateStep1 = () => {
        const newErrors: { templateName?: string; title?: string } = {};

        if (!templateName.trim()) {
            newErrors.templateName = 'Template name is required';
        }

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit
    const handleSubmit = async () => {
        if (!validateStep1()) {
            toast.error('Please fill in template name and title');
            return;
        }

        setIsSubmitting(true);

        try {
            const templateData: Template = {
                templateName: templateName.trim(),
                title: title.trim(),
                sections,
            };

            await templateService.createBriefFromTemplate(templateData);

            toast.success('Template created successfully!', {
                description: `"${templateName}" has been created.`,
            });

            router.push('/admin/templates');
        } catch (error: any) {
            toast.error('Failed to create template', {
                description: error.message || 'Please try again later.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ProtectedLayout role="ADMIN">
            <div className="flex flex-col h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push('/admin/templates')}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Back to templates"
                                >
                                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-base font-semibold text-gray-900">Create Template</h1>
                                    <p className="text-xs text-gray-500">Build a new template for briefs</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => router.push('/admin/templates')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-md hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Create Template
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Info Section */}
                <div className="bg-white border-b border-gray-200 px-4 py-2.5">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Template Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className={`w-full px-2.5 py-1.5 text-black border rounded-md text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${errors.templateName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="e.g., Client Brief Template"
                                />
                                {errors.templateName && (
                                    <p className="text-xs text-red-500 mt-0.5">{errors.templateName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Template Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full px-2.5 py-1.5 text-black border rounded-md text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="e.g., Client Information Brief"
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-500 mt-0.5">{errors.title}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Section Tabs */}
                    {sections.length > 0 && (
                        <SectionTabsBar
                            sections={sections}
                            activeSectionIndex={activeSectionIndex}
                            onSectionClick={setActiveSectionIndex}
                            onAddSection={addSection}
                            onRemoveSection={removeSection}
                            onUpdateSectionName={updateSectionName}
                        />
                    )}

                    {/* Editor Area */}
                    {sections.length > 0 ? (
                        <div className="flex flex-1 overflow-hidden bg-gray-50">
                            {/* Field Group Sidebar */}
                            <FieldGroupSidebar
                                fieldGroups={sections[activeSectionIndex]?.inputFields || []}
                                activeGroupIndex={activeGroupIndex}
                                onGroupClick={setActiveGroupIndex}
                                onAddGroup={addFieldGroup}
                                onRemoveGroup={removeFieldGroup}
                                onUpdateGroupName={(index, name) => updateFieldGroupHeading(index, name)}
                            />

                            {/* Field Editor */}
                            <div className="flex-1 overflow-y-auto">
                                <SectionEditorStep
                                    section={sections[activeSectionIndex]}
                                    sectionIndex={activeSectionIndex}
                                    activeGroupIndex={activeGroupIndex}
                                    onUpdateSectionName={(name: string) => updateSectionName(activeSectionIndex, name)}
                                    onAddFieldGroup={addFieldGroup}
                                    onRemoveFieldGroup={removeFieldGroup}
                                    onUpdateFieldGroupHeading={updateFieldGroupHeading}
                                    onAddField={addField}
                                    onRemoveField={removeField}
                                    onUpdateField={updateField}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center max-w-md px-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Let's build your template
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    Start by adding sections to organize your form
                                </p>
                                <p className="text-xs text-gray-500 mb-4">
                                    <span className="font-semibold">Examples:</span> "Client Information", "Project Details"
                                </p>
                                <button
                                    onClick={addSection}
                                    className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-md hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
                                >
                                    <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                                    Add First Section
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedLayout >
    );
}

