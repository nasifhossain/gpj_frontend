import React from 'react';
import { BriefField } from '@/lib/types/brief';
import { Sparkles, User } from 'lucide-react';

interface FieldInputProps {
    field: BriefField;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}

// Helper function to convert various date formats to YYYY-MM-DD for HTML date input
function convertToHtmlDateFormat(dateValue: any): string {
    if (!dateValue) return '';

    const dateStr = String(dateValue).trim();

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }

    // Handle DD-MM-YYYY format (e.g., "29-09-2025")
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Handle M/D/YYYY format (e.g., "9/29/2025")
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        const parts = dateStr.split('/');
        // Check if it's M/D/YYYY or D/M/YYYY
        const month = parts[0];
        const day = parts[1];
        const year = parts[2];
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Try to parse as a Date object
    try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    } catch (e) {
        // Fall through
    }

    return '';
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
                        <option value="">Select an option</option>
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
                    // Convert the date value to YYYY-MM-DD format for HTML date input
                    const htmlDateValue = convertToHtmlDateFormat(currentValue);

                    return (
                        <input
                            type="date"
                            value={htmlDateValue}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled}
                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    );
                }

                if (field.dataType === 'Object') {
                    // For Object types like {Name, Email}, render as JSON textarea
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
