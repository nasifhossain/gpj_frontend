import React, { useState } from 'react';
import { Template, Section, InputField } from '@/lib/types';
import { templateService } from '@/lib/api';
import { toast } from 'sonner';
import {
    X, Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp,
    FileText, Layers, Grid, Type
} from 'lucide-react';

interface CreateTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [templateName, setTemplateName] = useState('');
    const [title, setTitle] = useState('');
    const [sections, setSections] = useState<Section[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedSections, setExpandedSections] = useState<number[]>([]);
    const [errors, setErrors] = useState<{ templateName?: string; title?: string }>({});

    const toggleSection = (index: number) => {
        setExpandedSections(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const addSection = () => {
        const newSection: Section = {
            sectionName: '',
            inputFields: []
        };
        setSections([...sections, newSection]);
        setExpandedSections([...expandedSections, sections.length]);
    };

    const removeSection = (index: number) => {
        setSections(sections.filter((_, i) => i !== index));
        setExpandedSections(expandedSections.filter(i => i !== index));
    };

    const updateSection = (index: number, field: keyof Section, value: any) => {
        const updated = [...sections];
        updated[index] = { ...updated[index], [field]: value };
        setSections(updated);
    };

    const addFieldGroup = (sectionIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex].inputFields.push({
            fieldsHeading: '',
            fields: []
        });
        setSections(updated);
    };

    const removeFieldGroup = (sectionIndex: number, groupIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex].inputFields = updated[sectionIndex].inputFields.filter((_, i) => i !== groupIndex);
        setSections(updated);
    };

    const updateFieldGroup = (sectionIndex: number, groupIndex: number, value: string) => {
        const updated = [...sections];
        updated[sectionIndex].inputFields[groupIndex].fieldsHeading = value;
        setSections(updated);
    };

    const addField = (sectionIndex: number, groupIndex: number) => {
        const updated = [...sections];
        const newField: InputField = {
            inputName: '',
            inputValue: null,
            dataType: 'String',
            fieldType: 'input',
        };
        updated[sectionIndex].inputFields[groupIndex].fields.push(newField);
        setSections(updated);
    };

    const removeField = (sectionIndex: number, groupIndex: number, fieldIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex].inputFields[groupIndex].fields =
            updated[sectionIndex].inputFields[groupIndex].fields.filter((_, i) => i !== fieldIndex);
        setSections(updated);
    };

    const updateField = (sectionIndex: number, groupIndex: number, fieldIndex: number, updates: Partial<InputField>) => {
        const updated = [...sections];
        updated[sectionIndex].inputFields[groupIndex].fields[fieldIndex] = {
            ...updated[sectionIndex].inputFields[groupIndex].fields[fieldIndex],
            ...updates
        };
        setSections(updated);
    };

    const validateForm = () => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const templateData: Template = {
                templateName: templateName.trim(),
                title: title.trim(),
                sections
            };

            await templateService.createBriefFromTemplate(templateData);

            toast.success('Template created successfully!', {
                description: `"${templateName}" has been created.`,
            });

            onSuccess?.();
            handleClose();
        } catch (error: any) {
            toast.error('Failed to create template', {
                description: error.message || 'Please try again later.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            setTimeout(() => {
                setTemplateName('');
                setTitle('');
                setSections([]);
                setExpandedSections([]);
                setErrors({});
            }, 300);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Create New Template</h2>
                                <p className="text-sm text-indigo-100 mt-0.5">
                                    Build your template with sections and fields
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Template Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={templateName}
                                        onChange={(e) => {
                                            setTemplateName(e.target.value);
                                            if (errors.templateName) setErrors({ ...errors, templateName: undefined });
                                        }}
                                        className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400 ${errors.templateName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Default Template-1"
                                        disabled={isSubmitting}
                                    />
                                    {errors.templateName && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.templateName}</p>
                                    )}
                                    <p className="mt-1.5 text-xs text-gray-500">Unique identifier for this template</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            if (errors.title) setErrors({ ...errors, title: undefined });
                                        }}
                                        className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., IBM Event Assessment Brief 2025"
                                        disabled={isSubmitting}
                                    />
                                    {errors.title && (
                                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.title}</p>
                                    )}
                                    <p className="mt-1.5 text-xs text-gray-500">Display name for this template</p>
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-indigo-600" />
                                    Sections ({sections.length})
                                </h3>
                                <button
                                    type="button"
                                    onClick={addSection}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Section
                                </button>
                            </div>

                            {sections.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">No sections yet. Click "Add Section" to get started.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sections.map((section, sIndex) => (
                                        <SectionBuilder
                                            key={sIndex}
                                            section={section}
                                            sectionIndex={sIndex}
                                            isExpanded={expandedSections.includes(sIndex)}
                                            onToggle={() => toggleSection(sIndex)}
                                            onRemove={() => removeSection(sIndex)}
                                            onUpdate={(field, value) => updateSection(sIndex, field, value)}
                                            onAddFieldGroup={() => addFieldGroup(sIndex)}
                                            onRemoveFieldGroup={(gIndex) => removeFieldGroup(sIndex, gIndex)}
                                            onUpdateFieldGroup={(gIndex, value) => updateFieldGroup(sIndex, gIndex, value)}
                                            onAddField={(gIndex) => addField(sIndex, gIndex)}
                                            onRemoveField={(gIndex, fIndex) => removeField(sIndex, gIndex, fIndex)}
                                            onUpdateField={(gIndex, fIndex, updates) => updateField(sIndex, gIndex, fIndex, updates)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Create Template
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Section Builder Component
interface SectionBuilderProps {
    section: Section;
    sectionIndex: number;
    isExpanded: boolean;
    onToggle: () => void;
    onRemove: () => void;
    onUpdate: (field: keyof Section, value: any) => void;
    onAddFieldGroup: () => void;
    onRemoveFieldGroup: (groupIndex: number) => void;
    onUpdateFieldGroup: (groupIndex: number, value: string) => void;
    onAddField: (groupIndex: number) => void;
    onRemoveField: (groupIndex: number, fieldIndex: number) => void;
    onUpdateField: (groupIndex: number, fieldIndex: number, updates: Partial<InputField>) => void;
}

const SectionBuilder: React.FC<SectionBuilderProps> = ({
    section,
    sectionIndex,
    isExpanded,
    onToggle,
    onRemove,
    onUpdate,
    onAddFieldGroup,
    onRemoveFieldGroup,
    onUpdateFieldGroup,
    onAddField,
    onRemoveField,
    onUpdateField,
}) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <button
                        type="button"
                        onClick={onToggle}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <input
                        type="text"
                        value={section.sectionName}
                        onChange={(e) => onUpdate('sectionName', e.target.value)}
                        placeholder="Section Name (e.g., Project Overview)"
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition-all"
                    />
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {isExpanded && (
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Field Groups ({section.inputFields.length})</span>
                        <button
                            type="button"
                            onClick={onAddFieldGroup}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Field Group
                        </button>
                    </div>

                    {section.inputFields.map((group, gIndex) => (
                        <FieldGroupBuilder
                            key={gIndex}
                            group={group}
                            groupIndex={gIndex}
                            onRemove={() => onRemoveFieldGroup(gIndex)}
                            onUpdateHeading={(value) => onUpdateFieldGroup(gIndex, value)}
                            onAddField={() => onAddField(gIndex)}
                            onRemoveField={(fIndex) => onRemoveField(gIndex, fIndex)}
                            onUpdateField={(fIndex, updates) => onUpdateField(gIndex, fIndex, updates)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Field Group Builder Component
interface FieldGroupBuilderProps {
    group: { fieldsHeading: string; fields: InputField[] };
    groupIndex: number;
    onRemove: () => void;
    onUpdateHeading: (value: string) => void;
    onAddField: () => void;
    onRemoveField: (fieldIndex: number) => void;
    onUpdateField: (fieldIndex: number, updates: Partial<InputField>) => void;
}

const FieldGroupBuilder: React.FC<FieldGroupBuilderProps> = ({
    group,
    groupIndex,
    onRemove,
    onUpdateHeading,
    onAddField,
    onRemoveField,
    onUpdateField,
}) => {
    return (
        <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
            <div className="flex items-center gap-3 mb-3">
                <Grid className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <input
                    type="text"
                    value={group.fieldsHeading}
                    onChange={(e) => onUpdateHeading(e.target.value)}
                    placeholder="Field Group Heading (e.g., Basic Details)"
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition-all"
                />
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                {group.fields.map((field, fIndex) => (
                    <FieldBuilder
                        key={fIndex}
                        field={field}
                        fieldIndex={fIndex}
                        onRemove={() => onRemoveField(fIndex)}
                        onUpdate={(updates) => onUpdateField(fIndex, updates)}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={onAddField}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add Field
            </button>
        </div>
    );
};

// Field Builder Component
interface FieldBuilderProps {
    field: InputField;
    fieldIndex: number;
    onRemove: () => void;
    onUpdate: (updates: Partial<InputField>) => void;
}

const FieldBuilder: React.FC<FieldBuilderProps> = ({ field, fieldIndex, onRemove, onUpdate }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-3 hover:border-indigo-300 transition-colors">
            <div className="flex items-start gap-3">
                <div className="flex-1 space-y-4">
                    {/* Input Name (only for non-Array fields) */}
                    {field.dataType !== 'Array' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Field Name
                            </label>
                            <input
                                type="text"
                                value={field.inputName || ''}
                                onChange={(e) => onUpdate({ inputName: e.target.value })}
                                placeholder="e.g., Project Name, Event Date"
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition-all"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Data Type
                            </label>
                            <select
                                value={field.dataType}
                                onChange={(e) => onUpdate({ dataType: e.target.value })}
                                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="String">String</option>
                                <option value="Date">Date</option>
                                <option value="Array">Array</option>
                                <option value="Object">Object</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Field Type
                            </label>
                            <select
                                value={field.fieldType}
                                onChange={(e) => onUpdate({ fieldType: e.target.value })}
                                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="input">Input</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="textarea">Textarea</option>
                            </select>
                        </div>
                    </div>

                    {/* Options for dropdown */}
                    {field.fieldType === 'dropdown' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Dropdown Options
                            </label>
                            <input
                                type="text"
                                value={field.options?.join(', ') || ''}
                                onChange={(e) => onUpdate({ options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="e.g., Option1, Option2, Option3"
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate options with commas</p>
                        </div>
                    )}

                    {/* Advanced Options Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                    >
                        {showAdvanced ? '▼' : '▶'} {showAdvanced ? 'Hide' : 'Show'} Advanced Options (Prompt & Helper Text)
                    </button>

                    {showAdvanced && (
                        <div className="space-y-3 pt-2 border-t border-gray-200">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    AI Prompt (Optional)
                                </label>
                                <textarea
                                    value={field.prompt || ''}
                                    onChange={(e) => onUpdate({ prompt: e.target.value })}
                                    placeholder="e.g., Extract the exact project name for the event '{event_name}' from the provided context."
                                    rows={2}
                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition-all"
                                />
                                <p className="mt-1 text-xs text-gray-500">Instructions for AI to extract this field</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Helper Text (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={field.helperText?.join(', ') || ''}
                                    onChange={(e) => onUpdate({ helperText: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    placeholder="e.g., Hint 1, Hint 2, Hint 3"
                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400 transition-all"
                                />
                                <p className="mt-1 text-xs text-gray-500">Helpful hints for users (comma-separated)</p>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Remove field"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
