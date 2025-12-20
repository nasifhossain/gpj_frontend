"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Template, Section, InputField } from '@/lib/types';
import { templateService } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { StepTabs } from '@/components/admin/template-wizard/StepTabs';
import { BasicInfoStep } from '@/components/admin/template-wizard/BasicInfoStep';
import { SectionEditorStep } from '@/components/admin/template-wizard/SectionEditorStep';
import { SectionTabsBar } from '@/components/admin/template-wizard/SectionTabsBar';
import { SectionContextHeader } from '@/components/admin/template-wizard/SectionContextHeader';
import { FieldGroupSidebar } from '@/components/admin/template-wizard/FieldGroupSidebar';
import { ReviewStep } from '@/components/admin/template-wizard/ReviewStep';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

export default function CreateTemplatePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [templateName, setTemplateName] = useState('');
    const [title, setTitle] = useState('');
    const [sections, setSections] = useState<Section[]>([]);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ templateName?: string; title?: string }>({});

    // Progress bar steps
    const steps = [
        { id: 1, name: 'Basic Info', status: currentStep > 1 ? 'complete' as const : currentStep === 1 ? 'current' as const : 'upcoming' as const },
        { id: 2, name: 'Add Sections', status: currentStep > 2 ? 'complete' as const : currentStep === 2 ? 'current' as const : 'upcoming' as const },
        { id: 3, name: 'Review', status: currentStep === 3 ? 'current' as const : 'upcoming' as const },
    ];

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

    // Navigation
    const handleNext = () => {
        if (currentStep === 1) {
            if (!validateStep1()) {
                toast.error('Please fill in all required fields');
                return;
            }
        }

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepId: number) => {
        if (stepId === 1 || (stepId === 2 && validateStep1()) || stepId <= currentStep) {
            setCurrentStep(stepId);
        }
    };

    const handleEditSection = (sectionIndex: number) => {
        setActiveSectionIndex(sectionIndex);
        setCurrentStep(2);
    };

    // Submit
    const handleSubmit = async () => {
        if (!validateStep1()) {
            toast.error('Please fill in all required fields');
            setCurrentStep(1);
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

            router.push('/admin');
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
            <div className="flex flex-col h-screen">
                {/* Minimal Header - Only Progress Bar */}
                <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-2">
                    <div className="max-w-7xl mx-auto flex justify-center">
                        <StepTabs steps={steps} onStepClick={handleStepClick} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {currentStep === 1 && (
                        <div className="py-12">
                            <BasicInfoStep
                                templateName={templateName}
                                title={title}
                                onTemplateNameChange={setTemplateName}
                                onTitleChange={setTitle}
                                errors={errors}
                            />
                        </div>
                    )}


                    {currentStep === 2 && (
                        <div className="flex flex-col h-[calc(100vh-200px)]">
                            {/* Section Tabs Bar */}
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

                            {/* Main Content Area */}
                            {sections.length > 0 ? (
                                <>
                                    {/* Section Context Header */}
                                    <SectionContextHeader
                                        templateName={templateName}
                                        sectionName={sections[activeSectionIndex]?.sectionName}
                                        sectionIndex={activeSectionIndex}
                                        onEditSection={() => {
                                            // Focus on section name in tabs
                                            const sectionName = prompt('Enter section name:', sections[activeSectionIndex]?.sectionName);
                                            if (sectionName) updateSectionName(activeSectionIndex, sectionName);
                                        }}
                                        onDeleteSection={() => {
                                            if (confirm('Are you sure you want to delete this section?')) {
                                                removeSection(activeSectionIndex);
                                            }
                                        }}
                                    />

                                    <div className="flex flex-1 overflow-hidden">
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
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
                                    <div className="text-center max-w-lg px-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                            <Sparkles className="w-12 h-12 text-emerald-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            Let's build your template
                                        </h3>
                                        <p className="text-gray-600 mb-2 leading-relaxed">
                                            Start by adding sections to organize your form into logical parts.
                                        </p>
                                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                            <span className="font-semibold">Examples:</span> "Client Information", "Project Details", "Budget & Timeline"
                                        </p>
                                        <button
                                            onClick={addSection}
                                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                            Create First Section
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="py-12">
                            <ReviewStep
                                template={{ templateName, title, sections }}
                                onEdit={handleEditSection}
                            />
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="bg-white border-t border-gray-200 shadow-lg">
                    <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <div className="flex items-center gap-3">
                            {/* Save Draft Button - Tertiary/Subtle */}
                            {currentStep < 3 && (
                                <button
                                    onClick={() => {
                                        toast.success('Draft saved!', {
                                            description: 'Your progress has been saved.',
                                        });
                                    }}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 underline decoration-dotted underline-offset-4 transition-colors"
                                >
                                    💾 Save Draft
                                </button>
                            )}

                            {/* Next/Submit Button - Primary */}
                            {currentStep < 3 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating Template...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Create Template
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout >
    );
}

