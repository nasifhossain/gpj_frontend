"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Template, Section, InputField } from '@/lib/types';
import { templateService } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, X } from 'lucide-react';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { LoadingSpinner, ErrorAlert } from '@/components/shared/StatusComponents';
import { SectionTabsBar } from '@/components/admin/template-wizard/SectionTabsBar';
import { SectionEditorStep } from '@/components/admin/template-wizard/SectionEditorStep';
import { FieldGroupSidebar } from '@/components/admin/template-wizard/FieldGroupSidebar';

export default function EditTemplatePage() {
    const router = useRouter();
    const params = useParams();
    const templateId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [templateName, setTemplateName] = useState('');
    const [title, setTitle] = useState('');
    const [sections, setSections] = useState<Section[]>([]);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch template data on mount
    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                setLoading(true);
                const templates = await templateService.getTemplates();
                const template = templates.find(t => t.id === templateId);

                if (!template) {
                    setLoadError('Template not found');
                    return;
                }

                setTemplateName(template.templateName);
                setTitle(template.title);
                setSections(template.sections);
            } catch (error: any) {
                setLoadError(error.message || 'Failed to load template');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId]);

    // Section management
    const addSection = () => {
        const newSection: Section = {
            sectionName: '',
            inputFields: [],
        };
        setSections([...sections, newSection]);
        setActiveSectionIndex(sections.length);
        toast.success('Section added!');
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
        toast.success('Field group added!');
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

    // Submit
    const handleSubmit = async () => {
        if (!templateName.trim() || !title.trim()) {
            toast.error('Template name and title are required');
            return;
        }

        setIsSubmitting(true);

        try {
            const templateData: Template = {
                id: templateId,
                templateName: templateName.trim(),
                title: title.trim(),
                sections,
            };

            await templateService.updateBriefFromTemplate(templateData);

            toast.success('Template updated successfully!', {
                description: `"${templateName}" has been updated.`,
            });

            router.push('/admin/templates');
        } catch (error: any) {
            toast.error('Failed to update template', {
                description: error.message || 'Please try again later.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <ProtectedLayout role="ADMIN">
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner />
                </div>
            </ProtectedLayout>
        );
    }

    if (loadError) {
        return (
            <ProtectedLayout role="ADMIN">
                <div className="flex items-center justify-center h-screen">
                    <ErrorAlert message={loadError} />
                </div>
            </ProtectedLayout>
        );
    }

    return (
        <ProtectedLayout role="ADMIN">
            <div className="flex flex-col h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.push('/admin/templates')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Back to templates"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Edit Template</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">Make changes to your template</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push('/admin/templates')}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Info Section */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Template Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="e.g., Client Brief Template"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Template Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="e.g., Client Information Brief"
                                />
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
                                <p className="text-gray-500 mb-4">No sections yet</p>
                                <button
                                    onClick={addSection}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md"
                                >
                                    Add First Section
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedLayout>
    );
}
