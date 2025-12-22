"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { UsersList } from '@/components/admin/UsersList';
import { UserFormModal } from '@/components/admin/UserFormModal';
import { LoadingSpinner, ErrorAlert } from '@/components/shared/StatusComponents';
import { usersService } from '@/lib/api/users';
import { User, CreateUserRequest, UpdateUserRequest } from '@/lib/types/user';
import { Users, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await usersService.getUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await usersService.deleteUser(userId);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete user');
        }
    };

    const handleSubmitUser = async (data: CreateUserRequest | UpdateUserRequest) => {
        try {
            if (modalMode === 'create') {
                await usersService.createUser(data as CreateUserRequest);
                toast.success('User created successfully');
            } else if (selectedUser) {
                await usersService.updateUser(selectedUser.id, data as UpdateUserRequest);
                toast.success('User updated successfully');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            throw err; // Let the modal handle the error display
        }
    };

    return (
        <ProtectedLayout role="ADMIN">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                            </div>
                            <p className="text-gray-600 ml-13">
                                Manage user accounts and permissions
                            </p>
                        </div>
                        <button
                            onClick={handleCreateUser}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Create User
                        </button>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <ErrorAlert message={error} />
                    ) : (
                        <UsersList
                            users={users}
                            onEditUser={handleEditUser}
                            onDeleteUser={handleDeleteUser}
                        />
                    )}
                </div>
            </div>

            {/* Modal */}
            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitUser}
                user={selectedUser}
                mode={modalMode}
            />
        </ProtectedLayout>
    );
}
