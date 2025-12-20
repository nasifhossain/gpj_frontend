import React from 'react';
import { BriefField } from '@/lib/types/brief';
import { Sparkles, User } from 'lucide-react';

interface FieldInputProps {
    field: BriefField;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}

export function FieldInput({ field, value, onChange, disabled = false }: FieldInputProps) {
    const currentValue = value ?? field.value?.value ?? field.options.defaultValue ?? '';
    const isAIGenerated = field.value?.source === 'AI';

    const renderInput = () => {
        switch (field.fieldType) {
            case 'dropdown':
                return (
                    <select
                        value={currentValue}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Se select an option</option>
                        {field.options.dropdownOptions?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        value={currentValue}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        rows={6}
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
                        placeholder={field.options.helperText?.[0] || `Enter ${field.label.toLowerCase()}...`}
                    />
                );

            case 'input':
            default:
                if (field.dataType === 'Date') {
                    return (
                        <input
                            type="date"
                            value={currentValue}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled}
                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    );
                }

                if (field.dataType === 'Object') {
                    // For Object types like {Name, Email}, render as JSON textarea for now
                    const objValue = typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue, null, 2);
                    return (
                        <textarea
                            value={objValue}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    onChange(parsed);
                                } catch {
                                    onChange(e.target.value);
                                }
                            }}
                            disabled={disabled}
                            rows={4}
                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
                            placeholder={`{"Name": "", "Email": ""}`}
                        />
                    );
                }

                return (
                    <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                );
        }
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                    {field.label}
                </span>
                {isAIGenerated && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                        {field.value?.confidence && (
                            <span className="ml-1 text-purple-600">
                                ({Math.round(field.value.confidence * 100)}%)
                            </span>
                        )}
                    </span>
                )}
                {field.value?.source === 'MANUAL' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        <User className="w-3 h-3" />
                        Manual
                    </span>
                )}
            </label>
            {renderInput()}
            {field.options.helperText && field.fieldType !== 'textarea' && (
                <p className="text-xs text-gray-500 mt-1">{field.options.helperText[0]}</p>
            )}
        </div>
    );
}
