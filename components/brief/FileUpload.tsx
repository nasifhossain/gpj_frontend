import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    uploading?: boolean;
    uploadedFiles?: Array<{ id: string; name: string; s3Key: string }>;
    onRemoveFile?: (documentId: string) => void;
}

export function FileUpload({ onFilesSelected, uploading = false, uploadedFiles = [], onRemoveFile }: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const filesArray = Array.from(e.dataTransfer.files);
            onFilesSelected(filesArray);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            onFilesSelected(filesArray);
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${dragActive
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.pptx,.xlsx,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                />

                <div className="flex flex-col items-center gap-3">
                    {uploading ? (
                        <>
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                            <p className="text-sm font-medium text-gray-700">Uploading files...</p>
                            <p className="text-xs text-gray-500">Please wait while we upload your documents</p>
                        </>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Drop files here or click to browse
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: PDF, PPTX, XLSX, DOCX
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded Documents ({uploadedFiles.length})</p>
                    <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm text-gray-700">{file.name}</span>
                                </div>
                                {onRemoveFile && (
                                    <button
                                        onClick={() => onRemoveFile(file.id)}
                                        className="p-1 hover:bg-red-100 rounded transition-colors group"
                                        title="Remove file"
                                    >
                                        <X className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
