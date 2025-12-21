"use client";

import React from 'react';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
    return (
        <ProtectedLayout role="ADMIN">
            <AdminDashboard />
        </ProtectedLayout>
    );
}
