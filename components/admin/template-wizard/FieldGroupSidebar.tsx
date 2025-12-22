import React, { useState } from 'react';
import { Grid, Plus, Trash2, ChevronRight, Edit2 } from 'lucide-react';

interface FieldGroup {
    fieldsHeading: string;
    fields: any[];
}

interface FieldGroupSidebarProps {
    fieldGroups: FieldGroup[];
    activeGroupIndex: number;
    onGroupClick: (index: number) => void;
    onAddGroup: () => void;
    onRemoveGroup: (index: number) => void;
    onUpdateGroupName: (index: number, name: string) => void;
}

export const FieldGroupSidebar: React.FC<FieldGroupSidebarProps> = ({
    fieldGroups,
    activeGroupIndex,
    onGroupClick,
    onAddGroup,
    onRemoveGroup,
    onUpdateGroupName,
}) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const startEditing = (index: number, currentName: string) => {
        setEditingIndex(index);
        setEditValue(currentName || `Group ${index + 1}`);
    };

    const finishEditing = () => {
        if (editingIndex !== null && editValue.trim()) {
            onUpdateGroupName(editingIndex, editValue.trim());
        }
        setEditingIndex(null);
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="px-3 py-2 border-b border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-emerald-600" />
                    <h3 className="text-xs font-bold text-gray-900">Field Groups</h3>
                </div>
            </div>

            {/* Field Group List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {fieldGroups.length === 0 ? (
                    <div className="text-center py-8 px-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Grid className="w-7 h-7 text-emerald-600" />
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium mb-2">No field groups yet.</p>
                        <p className="text-xs text-gray-500 leading-relaxed">Examples: "Contact Details", "Company Info"</p>
                    </div>
                ) : (
                    fieldGroups.map((group, index) => {
                        const isActive = index === activeGroupIndex;
                        const isEditing = editingIndex === index;

                        return (
                            <div
                                key={index}
                                className={`
                                    group relative rounded-lg transition-all duration-200
                                    ${isActive
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                    }
                                `}
                                onClick={() => !isEditing && onGroupClick(index)}
                            >
                                <div className="p-2 flex items-center gap-1.5">
                                    <ChevronRight className={`w-3 h-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={finishEditing}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') finishEditing();
                                                    if (e.key === 'Escape') setEditingIndex(null);
                                                }}
                                                className="w-full px-2 py-0.5 text-xs font-semibold bg-white text-gray-900 border border-emerald-500 rounded focus:outline-none focus:ring-1 focus:ring-emerald-300"
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <>
                                                <div className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                                    {group.fieldsHeading || `Group ${index + 1}`}
                                                </div>
                                                <div className={`text-xs mt-0.5 ${isActive ? 'text-emerald-100' : 'text-gray-500'}`}>
                                                    {group.fields.length} field{group.fields.length !== 1 ? 's' : ''}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Edit Button */}
                                    {!isEditing && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(index, group.fieldsHeading);
                                            }}
                                            className={`
                                                flex-shrink-0 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100
                                                ${isActive ? 'hover:bg-white/20 text-white' : 'hover:bg-emerald-100 text-emerald-600'}
                                            `}
                                            title="Edit group name"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    )}

                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveGroup(index);
                                        }}
                                        className={`
                                            flex-shrink-0 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100
                                            ${isActive ? 'hover:bg-white/20 text-white' : 'hover:bg-red-100 text-red-600'}
                                        `}
                                        title="Remove group"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Group Button */}
            <div className="p-2 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={onAddGroup}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Field Group
                </button>
            </div>
        </div>
    );
};
