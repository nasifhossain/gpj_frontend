import { pdf } from '@react-pdf/renderer';
import { Brief } from '@/lib/types/brief';
import { BriefPDFDocument } from '@/components/pdf/BriefPDFDocument';
import React from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: string;
    name: string;
    email: string;
    role: string;
    exp: number;
}

/**
 * Gets user information from JWT token
 * @returns User info object or null if token is invalid
 */
const getUserFromToken = (): { name: string; email: string } | null => {
    try {
        const token = Cookies.get('token');
        if (!token) return null;

        const decoded = jwtDecode<DecodedToken>(token);
        return {
            name: decoded.name,
            email: decoded.email,
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Generates a PDF blob from brief data
 * @param brief - The brief data to generate PDF from
 * @returns Promise that resolves to a Blob containing the PDF
 */
export const generateBriefPDF = async (brief: Brief): Promise<Blob> => {
    try {
        // Get current user info from token
        const user = getUserFromToken();

        // Generate the PDF blob
        const blob = await pdf(<BriefPDFDocument brief={brief} user={user || undefined} />).toBlob();

        return blob;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF. Please try again.');
    }
};

/**
 * Triggers a browser download for the given blob
 * @param blob - The blob to download
 * @param filename - The filename for the download
 */
export const downloadPDF = (blob: Blob, filename: string): void => {
    try {
        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw new Error('Failed to download PDF. Please try again.');
    }
};

/**
 * Opens the PDF in a new browser tab for preview/debugging
 * @param blob - The blob to open
 */
export const openPDFInNewTab = (blob: Blob): void => {
    try {
        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // Open in new tab
        window.open(url, '_blank');

        // Note: We don't revoke the URL immediately as the new tab needs it
        // The browser will clean it up when the tab is closed
    } catch (error) {
        console.error('Error opening PDF:', error);
        throw new Error('Failed to open PDF. Please try again.');
    }
};

/**
 * Generates and opens a PDF in a new tab for the given brief
 * @param brief - The brief data to generate PDF from
 */
export const generateAndPreviewBriefPDF = async (
    brief: Brief
): Promise<void> => {
    // Generate the PDF
    const blob = await generateBriefPDF(brief);

    // Open in new tab
    openPDFInNewTab(blob);
};

/**
 * Generates and downloads a PDF for the given brief
 * @param brief - The brief data to generate PDF from
 * @param filename - Optional custom filename (defaults to brief title)
 */
export const generateAndDownloadBriefPDF = async (
    brief: Brief,
    filename?: string
): Promise<void> => {
    // Generate the PDF
    const blob = await generateBriefPDF(brief);

    // Create filename from brief title if not provided
    const pdfFilename = filename || `${brief.title.replace(/[^a-z0-9]/gi, '_')}_Brief.pdf`;

    // Download the PDF
    downloadPDF(blob, pdfFilename);
};
