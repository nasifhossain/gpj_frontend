import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return (
        <div className={`flex justify-center items-center h-64 ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-emerald-600 ${sizeClasses[size]}`}></div>
        </div>
    );
}

interface ErrorAlertProps {
    message: string;
    className?: string;
}

export function ErrorAlert({ message, className = '' }: ErrorAlertProps) {
    return (
        <div className={`bg-red-50 border-l-4 border-red-400 p-4 ${className}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700">{message}</p>
                </div>
            </div>
        </div>
    );
}
