import React, { useState, useEffect } from 'react';
import { InputField } from '@/lib/types';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface FieldCardProps {
    field: InputField;
    onUpdate: (updates: Partial<InputField>) => void;
    onRemove: () => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field, onUpdate, onRemove }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [optionsText, setOptionsText] = useState('');

    // Initialize options text from field.options
    useEffect(() => {
        if (field.options) {
            setOptionsText(field.options.join(', '));
        }
    }, [field.options]);

    const handleOptionsBlur = () => {
        // Parse options when user finishes editing
        const parsedOptions = optionsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        onUpdate({ options: parsedOptions });
    };

    return (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-emerald-300 transition-all shadow-sm">
            <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                    {/* Field Name */}
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
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 transition-all"
                            />
                        </div>
                    )}

                    {/* Data Type & Field Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Data Type
                            </label>
                            <select
                                value={field.dataType}
                                onChange={(e) => onUpdate({ dataType: e.target.value })}
                                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                                <option value="input">Input</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="textarea">Textarea</option>
                            </select>
                        </div>
                    </div>

                    {/* Dropdown Options */}
                    {field.fieldType === 'dropdown' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Dropdown Options
                            </label>
                            <input
                                type="text"
                                value={optionsText}
                                onChange={(e) => setOptionsText(e.target.value)}
                                onBlur={handleOptionsBlur}
                                placeholder="e.g., Option1, Option2, Option3"
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500">Separate options with commas</p>
                        </div>
                    )}

                    {/* Advanced Options Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                    >
                        {showAdvanced ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                    </button>

                    {/* Advanced Options */}
                    {showAdvanced && (
                        <div className="space-y-4 pt-3 border-t border-gray-200">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    AI Prompt (Optional)
                                </label>
                                <textarea
                                    value={field.prompt || ''}
                                    onChange={(e) => onUpdate({ prompt: e.target.value })}
                                    placeholder="e.g., Extract the exact project name from the provided context."
                                    rows={2}
                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 transition-all"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Instructions for AI to extract this field
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Helper Text (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={field.helperText?.join(', ') || ''}
                                    onChange={(e) =>
                                        onUpdate({
                                            helperText: e.target.value
                                                .split(',')
                                                .map((s) => s.trim())
                                                .filter(Boolean),
                                        })
                                    }
                                    placeholder="e.g., Hint 1, Hint 2, Hint 3"
                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 transition-all"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Helpful hints for users (comma-separated)
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Remove Button */}
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove field"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
