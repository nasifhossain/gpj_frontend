import React from 'react';
import { Check } from 'lucide-react';

interface Step {
    id: number;
    name: string;
    status: 'complete' | 'current' | 'upcoming';
}

interface StepTabsProps {
    steps: Step[];
    onStepClick: (stepId: number) => void;
}

export const StepTabs: React.FC<StepTabsProps> = ({ steps, onStepClick }) => {
    return (
        <div className="flex items-center gap-0">
            {steps.map((step, stepIdx) => {
                const isComplete = step.status === 'complete';
                const isCurrent = step.status === 'current';
                const isUpcoming = step.status === 'upcoming';

                return (
                    <button
                        key={step.id}
                        onClick={() => onStepClick(step.id)}
                        className={`
                            relative flex items-center gap-3 px-8 py-4 transition-all duration-300
                            ${stepIdx === 0 ? 'pl-6' : 'pl-10'}
                            ${stepIdx === steps.length - 1 ? 'pr-6' : 'pr-10'}
                            ${isComplete
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg'
                                : isCurrent
                                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xl scale-105 z-10'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }
                        `}
                        style={{
                            clipPath: stepIdx === steps.length - 1
                                ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)'
                                : stepIdx === 0
                                    ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)'
                                    : 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)',
                        }}
                    >
                        {/* Step Number/Icon */}
                        <div
                            className={`
                                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                                ${isComplete
                                    ? 'bg-white/20 backdrop-blur-sm'
                                    : isCurrent
                                        ? 'bg-white/20 backdrop-blur-sm ring-2 ring-white/50'
                                        : 'bg-white/50'
                                }
                            `}
                        >
                            {isComplete ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <span className={isCurrent ? 'text-white' : 'text-gray-700'}>
                                    {step.id}
                                </span>
                            )}
                        </div>

                        {/* Step Name */}
                        <span className={`font-semibold text-sm whitespace-nowrap ${isCurrent ? 'text-white' : isComplete ? 'text-white' : 'text-gray-700'
                            }`}>
                            {step.name}
                        </span>

                        {/* Glow effect for current step */}
                        {isCurrent && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 opacity-20 blur-xl -z-10" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
