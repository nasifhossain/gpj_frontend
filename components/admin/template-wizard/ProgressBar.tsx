import React from 'react';
import { Check } from 'lucide-react';

interface Step {
    id: number;
    name: string;
    status: 'complete' | 'current' | 'upcoming';
}

interface ProgressBarProps {
    steps: Step[];
    onStepClick: (stepId: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, onStepClick }) => {
    return (
        <nav aria-label="Progress" className="w-full">
            <ol className="flex items-center justify-between">
                {steps.map((step, stepIdx) => (
                    <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                        <div className="flex items-center">
                            {/* Step Circle */}
                            <button
                                onClick={() => onStepClick(step.id)}
                                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${step.status === 'complete'
                                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/50'
                                        : step.status === 'current'
                                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/50 ring-4 ring-indigo-100'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {step.status === 'complete' ? (
                                    <Check className="h-5 w-5 text-white" />
                                ) : (
                                    <span
                                        className={`text-sm font-semibold ${step.status === 'current' ? 'text-white' : 'text-gray-600'
                                            }`}
                                    >
                                        {step.id}
                                    </span>
                                )}
                            </button>

                            {/* Step Name */}
                            <span
                                className={`ml-3 text-sm font-medium transition-colors ${step.status === 'complete'
                                        ? 'text-emerald-600'
                                        : step.status === 'current'
                                            ? 'text-indigo-600'
                                            : 'text-gray-500'
                                    }`}
                            >
                                {step.name}
                            </span>

                            {/* Connector Line */}
                            {stepIdx !== steps.length - 1 && (
                                <div className="ml-4 flex-1 h-0.5 bg-gray-200 relative">
                                    <div
                                        className={`absolute inset-0 transition-all duration-500 ${step.status === 'complete'
                                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                : ''
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
