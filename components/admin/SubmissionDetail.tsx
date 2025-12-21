import React from 'react';
import { TemplateSubmission } from '@/lib/types/brief';
import { ArrowLeft, User, Mail, Shield, FileText, Layers } from 'lucide-react';

interface SubmissionDetailProps {
    template: TemplateSubmission;
    onBack: () => void;
}

export const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ template, onBack }) => {
    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>
            </div>

            {/* Template Info Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.templateName}</h2>
                        <p className="text-gray-600">{template.title}</p>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <Layers className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                                {template.sections.length} {template.sections.length === 1 ? 'section' : 'sections'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Submissions ({template.submissions.length})
                    </h3>
                </div>

                {template.submissions.length === 0 ? (
                    <div className="p-12 text-center">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No submissions yet for this template.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Name
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Role
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {template.submissions.map((submission, index) => (
                                    <tr
                                        key={submission.id}
                                        onClick={() => window.location.href = `/admin/submissions/${template.id}/user/${submission.id}`}
                                        className="hover:bg-emerald-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-emerald-700">
                                                        {submission.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{submission.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{submission.email}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${submission.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {submission.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Template Structure */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Structure</h3>
                <div className="space-y-4">
                    {template.sections.map((section, index) => (
                        <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                                {section.sectionName || `Section ${index + 1}`}
                            </h4>
                            <div className="text-sm text-gray-600">
                                {section.inputFields.length} field {section.inputFields.length === 1 ? 'group' : 'groups'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
