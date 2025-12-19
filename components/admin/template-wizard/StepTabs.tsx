import React from 'react';
import { Check, FileText, Grid, Eye } from 'lucide-react';

interface Step {
    id: number;
    name: string;
    status: 'complete' | 'current' | 'upcoming';
}

interface StepTabsProps {
    steps: Step[];
    onStepClick: (stepId: number) => void;
}

const stepIcons = {
    1: FileText,
    2: Grid,
    3: Eye,
};

export const StepTabs: React.FC<StepTabsProps> = ({ steps, onStepClick }) => {
    return (
        <div className="flex items-center gap-0">
            {steps.map((step, stepIdx) => {
                const isComplete = step.status === 'complete';
                const isCurrent = step.status === 'current';
                const isUpcoming = step.status === 'upcoming';
                const Icon = stepIcons[step.id as keyof typeof stepIcons];

                return (
                    <button
                        key={step.id}
                        onClick={() => onStepClick(step.id)}
                        disabled={isUpcoming && !isComplete}
                        className={`
                            relative flex items-center gap-2 px-6 py-2 transition-all duration-300
                            ${stepIdx === 0 ? 'pl-4' : 'pl-8'}
                            ${stepIdx === steps.length - 1 ? 'pr-4' : 'pr-8'}
                            ${isComplete
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md'
                                : isCurrent
                                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg scale-105 z-10'
                                    : 'bg-gray-200 text-gray-500 opacity-60'
                            }
                            ${isUpcoming && !isComplete ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        style={{
                            clipPath: stepIdx === steps.length - 1
                                ? 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)'
                                : stepIdx === 0
                                    ? 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)'
                                    : 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)',
                        }}
                    >
                        {/* Step Icon/Number */}
                        <div
                            className={`
                                flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs
                                ${isComplete
                                    ? 'bg-white/20 backdrop-blur-sm'
                                    : isCurrent
                                        ? 'bg-white/20 backdrop-blur-sm ring-2 ring-white/50'
                                        : 'bg-white/30'
                                }
                            `}
                        >
                            {isComplete ? (
                                <Check className="w-4 h-4" />
                            ) : Icon ? (
                                <Icon className="w-3.5 h-3.5" />
                            ) : (
                                <span className={isCurrent ? 'text-white' : 'text-gray-600'}>
                                    {step.id}
                                </span>
                            )}
                        </div>

                        {/* Step Name */}
                        <span className={`font-medium text-xs whitespace-nowrap ${isCurrent ? 'text-white font-bold' : isComplete ? 'text-white' : 'text-gray-600'
                            }`}>
                            {step.name}
                        </span>

                        {/* Glow effect for current step */}
                        {isCurrent && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 opacity-20 blur-lg -z-10" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
