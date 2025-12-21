import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Brief, BriefField } from '@/lib/types/brief';

//////////////////////////////////////////////////////
// STYLES
//////////////////////////////////////////////////////

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 80, // reserve space for footer
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },

    /* ---------- HEADER ---------- */

    header: {
        marginBottom: 30,
        borderBottom: '2pt solid #10b981',
        paddingBottom: 15,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 11,
        color: '#6b7280',
    },

    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        borderTop: '1pt solid #e5e7eb',
        paddingTop: 10,
    },

    metaItem: {
        flexDirection: 'row',
        gap: 4,
    },

    metaLabel: {
        fontSize: 9,
        color: '#6b7280',
        fontWeight: 'bold',
    },

    metaValue: {
        fontSize: 9,
        color: '#374151',
    },

    statusBadge: {
        fontSize: 9,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },

    statusDraft: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
    },

    statusInProgress: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
    },

    statusApproved: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
    },

    /* ---------- SECTIONS ---------- */

    section: {
        marginBottom: 28,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        borderBottom: '2pt solid #10b981',
        paddingBottom: 6,
        marginBottom: 14,
    },

    fieldGroup: {
        marginBottom: 16,
    },

    fieldGroupTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
        backgroundColor: '#f9fafb',
        padding: 6,
        borderRadius: 4,
        marginBottom: 8,
    },

    /* ---------- TABLE ROW (SHORT FIELDS) ---------- */

    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #e5e7eb',
        paddingHorizontal: 6,
        paddingTop: 8,
        paddingBottom: 8,
    },

    tableRowEven: {
        backgroundColor: '#f9fafb',
    },

    tableLabel: {
        width: '55%',
        paddingRight: 10,
        paddingTop: 2,
    },

    tableValue: {
        width: '45%',
        paddingTop: 2,
        paddingBottom: 2,
    },

    labelText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#4b5563',
    },

    valueText: {
        fontSize: 9,
        color: '#1f2937',
        lineHeight: 1.5,
    },

    emptyValue: {
        color: '#9ca3af',
        fontStyle: 'italic',
    },

    /* ---------- LONG FIELD (TEXTAREA / ARRAY) ---------- */

    longField: {
        border: '1pt solid #e5e7eb',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9fafb',
    },

    longFieldLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#374151',
    },

    longFieldValue: {
        fontSize: 9,
        lineHeight: 1.6,
        color: '#1f2937',
    },

    /* ---------- FOOTER ---------- */

    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#9ca3af',
        borderTop: '1pt solid #e5e7eb',
        paddingTop: 10,
    },
});

//////////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////////

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

const formatFieldValue = (field: BriefField): string => {
    if (!field.value?.value) return 'Not provided';

    const val = field.value.value;

    if (field.dataType === 'Array' && Array.isArray(val)) {
        return val.join('\n• ');
    }

    if (field.dataType === 'Object' && typeof val === 'object') {
        return Object.entries(val)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
    }

    return String(val);
};

const isLongField = (field: BriefField) =>
    field.fieldType === 'textarea' || field.dataType === 'Array';

const groupByHeading = (fields: BriefField[]) => {
    const groups: Record<string, BriefField[]> = {};
    fields.forEach(f => {
        const key = f.fieldHeading || 'Other';
        groups[key] = groups[key] || [];
        groups[key].push(f);
    });
    return groups;
};

const statusStyle = (status: string) => {
    if (status === 'APPROVED') return [styles.statusBadge, styles.statusApproved];
    if (status === 'IN_PROGRESS') return [styles.statusBadge, styles.statusInProgress];
    return [styles.statusBadge, styles.statusDraft];
};

//////////////////////////////////////////////////////
// COMPONENT
//////////////////////////////////////////////////////

interface UserInfo {
    name: string;
    email: string;
}

export const BriefPDFDocument: React.FC<{ brief: Brief; user?: UserInfo }> = ({ brief, user }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>{brief.title}</Text>
                    <Text style={styles.subtitle}>Template: {brief.templateName}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Status:</Text>
                            <Text style={statusStyle(brief.status)}>
                                {brief.status.replace('_', ' ')}
                            </Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Created:</Text>
                            <Text style={styles.metaValue}>{formatDate(brief.createdAt)}</Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Updated:</Text>
                            <Text style={styles.metaValue}>{formatDate(brief.updatedAt)}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.metaLabel}>Created By:</Text>
                            <Text style={styles.metaValue}>
                                {brief.createdBy.name} ({brief.createdBy.email})
                            </Text>
                        </View>
                        {user && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.metaLabel}>Generated By:</Text>
                                <Text style={styles.metaValue}>
                                    {user.name} ({user.email})
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* SECTIONS */}
                {brief.sections.map((section, sIdx) => {
                    const groups = groupByHeading(section.fields);

                    return (
                        <View key={section.id} style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                {sIdx + 1}. {section.sectionName}
                            </Text>

                            {Object.entries(groups).map(([heading, fields]) => (
                                <View key={heading} style={styles.fieldGroup}>
                                    <Text style={styles.fieldGroupTitle}>{heading}</Text>

                                    {fields.map((field, idx) =>
                                        isLongField(field) ? (
                                            <View key={field.id} style={styles.longField}>
                                                <Text style={styles.longFieldLabel}>{field.label}</Text>
                                                <Text style={styles.longFieldValue}>
                                                    {formatFieldValue(field)}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View
                                                key={field.id}
                                                style={[
                                                    styles.tableRow,
                                                    ...(idx % 2 === 1 ? [styles.tableRowEven] : [styles.tableRow]),
                                                ]}
                                            >
                                                <View style={styles.tableLabel}>
                                                    <Text style={styles.labelText}>{field.label}</Text>
                                                </View>
                                                <View style={styles.tableValue}>
                                                    <Text
                                                        style={[
                                                            styles.valueText,
                                                            ...(!field.value?.value ? [styles.emptyValue] : []),
                                                        ]}

                                                    >
                                                        {formatFieldValue(field)}
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    )}
                                </View>
                            ))}
                        </View>
                    );
                })}

                {/* FOOTER */}
                <Text
                    style={styles.footer}
                    render={({ pageNumber, totalPages }) =>
                        `Page ${pageNumber} of ${totalPages} • Generated on ${new Date().toLocaleDateString()}`
                    }
                    fixed
                />
            </Page>
        </Document>
    );
};
