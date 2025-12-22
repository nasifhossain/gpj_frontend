# GPJ Input Assistant - Frontend Application

## 📋 Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [User Roles & Access Control](#user-roles--access-control)
- [Core Features](#core-features)
- [Admin Guide](#admin-guide)
- [User Guide](#user-guide)
- [API Integration](#api-integration)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**GPJ Input Assistant** is an AI-powered brief generation and management platform designed to streamline the process of creating, managing, and filling out structured briefs. The application leverages artificial intelligence to automatically extract and populate field values from uploaded documents (PDF, PPTX, XLSX, DOCX), significantly reducing manual data entry time.

### Key Capabilities
- **AI-Powered Data Extraction**: Upload documents and let AI automatically fill brief sections
- **Template Management**: Create and manage reusable brief templates with custom sections and fields
- **Role-Based Access**: Separate admin and client portals with distinct permissions
- **Real-time Collaboration**: Track submissions, monitor progress, and review user inputs
- **PDF Generation**: Export completed briefs as professionally formatted PDF documents
- **Cloud Storage Integration**: Secure document storage via AWS S3

---

## 🏗️ System Architecture

### Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Authentication Layer                     │
│              (JWT-based, Role-based Access)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐         ┌───────▼────────┐
        │  Admin Portal  │         │  Client Portal │
        │                │         │                │
        │ - Dashboard    │         │ - Dashboard    │
        │ - Templates    │         │ - Templates    │
        │ - Submissions  │         │ - Brief Editor │
        │ - Analytics    │         │ - PDF Export   │
        └────────────────┘         └────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
        ┌─────────────────────▼─────────────────────┐
        │           Backend API Services             │
        │                                            │
        │  - Template Management                     │
        │  - Brief CRUD Operations                   │
        │  - AI Generation (Google Gemini)           │
        │  - Document Upload/Storage (S3)            │
        │  - User Submission Tracking                │
        └────────────────────────────────────────────┘
```

### Component Architecture

The application follows a **modular component-based architecture** with clear separation of concerns:

- **Pages** (`app/`): Route-based pages using Next.js App Router
- **Components** (`components/`): Reusable UI components organized by feature
- **API Layer** (`lib/api/`): Centralized API communication with type safety
- **Types** (`types/`, `lib/types/`): TypeScript interfaces for type safety
- **Middleware** (`middleware.ts`): Authentication and authorization guards

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js 16.1.0** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### State & Data Management
- **React Hooks** - State management
- **Custom Hooks** - Reusable logic (`useTemplates`)
- **JWT Decode** - Token parsing
- **js-cookie** - Cookie management

### Document Processing
- **@react-pdf/renderer** - PDF generation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 📁 Project Structure

```
gpj_frontend/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin-only routes
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── templates/           # Template management
│   │   │   ├── page.tsx         # Template list
│   │   │   ├── create/          # Create new template
│   │   │   └── [id]/            # Edit template
│   │   └── submissions/         # View user submissions
│   │       ├── page.tsx         # Submissions list
│   │       └── [id]/            # Submission details
│   │           └── [userId]/    # User-specific submission
│   ├── dashboard/               # Client dashboard
│   ├── login/                   # Authentication page
│   ├── templates/               # Client templates view
│   │   ├── page.tsx            # Available templates
│   │   └── [id]/               # Brief editor
│   ├── unauthorized/            # Access denied page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page (redirects)
│
├── components/                  # Reusable components
│   ├── admin/                  # Admin-specific components
│   │   ├── AdminDashboard.tsx  # Dashboard with analytics
│   │   ├── CreateTemplateModal.tsx  # Template builder
│   │   ├── TemplateCard.tsx    # Template display card
│   │   ├── TemplateDetail.tsx  # Template details view
│   │   ├── TemplateList.tsx    # Template listing
│   │   ├── SubmissionsList.tsx # Submissions overview
│   │   ├── SubmissionDetail.tsx # Single submission view
│   │   ├── UserSubmissionView.tsx # User submission details
│   │   └── template-wizard/    # Template creation wizard
│   ├── auth/                   # Authentication components
│   │   └── login-form.tsx      # Login/register form
│   ├── brief/                  # Brief editing components
│   │   ├── FieldInput.tsx      # Dynamic field input
│   │   └── FileUpload.tsx      # Document upload
│   ├── layout/                 # Layout components
│   │   └── ProtectedLayout.tsx # Auth-protected layout
│   ├── pdf/                    # PDF generation
│   │   └── BriefPDFDocument.tsx # PDF template
│   ├── shared/                 # Shared utilities
│   │   └── StatusComponents.tsx # Loading/error states
│   └── ui/                     # Base UI components
│       ├── button.tsx
│       ├── input.tsx
│       └── textarea.tsx
│
├── lib/                        # Core utilities and services
│   ├── api/                    # API service layer
│   │   ├── api.ts             # Base API client
│   │   ├── auth.ts            # Authentication API
│   │   ├── brief.ts           # Brief operations API
│   │   ├── submissions.ts     # Submissions API
│   │   └── template.ts        # Template API
│   ├── types/                 # Type definitions
│   │   └── brief.ts           # Brief-related types
│   ├── utils/                 # Utility functions
│   │   └── pdfGenerator.ts    # PDF generation utils
│   ├── api.ts                 # API exports
│   └── types.ts               # Core type definitions
│
├── types/                      # Global type definitions
│   └── auth.ts                # Authentication types
│
├── hooks/                      # Custom React hooks
│   └── useTemplates.ts        # Template data hook
│
├── middleware.ts              # Next.js middleware (auth)
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── .env                       # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- Access to the backend API (running locally or deployed)

### Installation

1. **Clone the repository**
   ```bash
   cd /path/to/gpj_input_assistant/gpj_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in the root directory
   touch .env
   ```
   
   Add the following:
   ```env
   NEXT_PUBLIC_API_BASE_URI=http://localhost:3001
   ```
   
   > **Note**: Replace with your backend API URL. For production, use the deployed backend URL.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - You'll be redirected to the login page

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## ⚙️ Environment Configuration

### Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_BASE_URI` | Backend API base URL | `http://localhost:3001` | Yes |

### Configuration Files

- **`next.config.ts`**: Next.js configuration
- **`tailwind.config.ts`**: Tailwind CSS customization
- **`tsconfig.json`**: TypeScript compiler options
- **`eslint.config.mjs`**: ESLint rules

---

## 🔐 User Roles & Access Control

### Role Types

The application supports two primary roles:

#### 1. **ADMIN**
- Full system access
- Can create and manage templates
- View all user submissions
- Access analytics dashboard
- Monitor system activity

#### 2. **CLIENT**
- Access to templates
- Create and edit briefs
- Upload documents
- Generate PDFs
- View own submissions

### Authentication Flow

```
1. User visits application → Redirected to /login
2. User enters credentials → JWT token generated
3. Token stored in secure cookie (7-day expiry)
4. User profile stored in localStorage
5. Middleware validates token on protected routes
6. User redirected to role-specific dashboard
```

### Protected Routes

The middleware (`middleware.ts`) enforces route protection:

**Admin Routes** (ADMIN only):
- `/admin/*`

**Client Routes** (CLIENT or ADMIN):
- `/dashboard/*`
- `/templates/*`
- `/profile/*`

**Public Routes**:
- `/login`
- `/unauthorized`

### Keyboard Shortcuts

- **⌘B / Ctrl+B**: Toggle sidebar visibility

---

## 🎨 Core Features

### 1. **Template Management** (Admin Only)

#### Creating Templates

Templates are the foundation of the brief system. Each template consists of:

- **Template Name**: Unique identifier
- **Title**: Display name
- **Sections**: Logical groupings of fields
  - **Section Name**: e.g., "Project Details", "Budget Information"
  - **Field Groups**: Sub-groupings within sections
    - **Fields Heading**: Group label
    - **Fields**: Individual input fields

#### Field Types

| Field Type | Data Type | Use Case | AI-Enabled |
|------------|-----------|----------|------------|
| `input` | String | Short text (names, titles) | ✅ |
| `textarea` | String | Long text (descriptions) | ✅ |
| `dropdown` | String | Predefined options | ✅ |
| `date` | Date | Date selection | ✅ |

#### Field Configuration

Each field can be configured with:

- **Input Name**: Field identifier
- **Data Type**: String, Date, Array, Object
- **Field Type**: input, textarea, dropdown
- **Prompt**: AI extraction instruction (optional)
- **Helper Text**: User guidance
- **Dropdown Options**: For dropdown fields
- **Default Value**: Pre-filled value

#### AI Prompt Configuration

For AI-powered fields, the **prompt** defines how the AI should extract data:

```
Example Prompt:
"Extract the project budget from the uploaded documents. 
Look for total cost, estimated budget, or financial allocation."
```

### 2. **Brief Creation & Editing** (Client)

#### Workflow

1. **Select Template**: Browse available templates
2. **Create Brief**: Initialize a new brief from template
3. **Fill Sections**: Navigate through sections using tabs
4. **Upload Documents** (Optional): For AI-powered extraction
5. **Generate with AI** (Optional): Auto-fill fields
6. **Manual Entry**: Fill or edit fields manually
7. **Save Section**: Persist changes
8. **Generate PDF**: Export completed brief

#### Document Upload

Supported formats:
- **PDF** (.pdf)
- **PowerPoint** (.pptx)
- **Excel** (.xlsx)
- **Word** (.docx)

Upload process:
1. Drag & drop or click to select files
2. Files uploaded to AWS S3 via signed URLs
3. Backend confirms upload
4. Documents associated with current section

#### AI Generation

When documents are uploaded:
1. Click "Generate with AI" button
2. Backend processes documents using Google Gemini
3. AI extracts relevant data based on field prompts
4. Fields auto-populated with extracted values
5. Confidence scores displayed for AI-generated values

#### Manual Editing

- All fields can be manually edited
- Changes tracked with source (`MANUAL` vs `AI`)
- Save section to persist changes
- Navigate between sections without losing data

### 3. **Submission Tracking** (Admin)

Admins can monitor all user submissions:

#### Dashboard Analytics

- **Total Templates**: Number of active templates
- **Total Submissions**: Unique user submissions
- **Templates with Submissions**: Templates in use
- **Average Submissions per Template**: Engagement metric
- **Recent Submissions**: Latest activity feed

#### Submission Details

For each template, view:
- **User List**: All users who submitted
- **Submission Count**: Number of submissions per template
- **User Details**: Name, email, role
- **Field Values**: All submitted data
- **AI Confidence**: For AI-generated fields
- **Timestamps**: Creation and update times

#### Viewing User Submissions

Navigate to: **Admin → Submissions → [Template] → [User]**

View includes:
- All sections and field groups
- Field values with source indicators
- AI confidence scores
- Empty field indicators
- PDF export capability

### 4. **PDF Generation**

Generate professional PDF documents from completed briefs:

#### Features
- **Branded Header**: User details from JWT token
- **Structured Layout**: Sections and field groups
- **Field Labels**: Clear field identification
- **Value Display**: Formatted field values
- **AI Indicators**: Confidence scores for AI fields
- **Responsive Design**: Dynamic field heights

#### Export Options
- **Preview**: Opens in new browser tab
- **Download**: Save to local machine

---

## 👨‍💼 Admin Guide

### Accessing Admin Panel

1. **Login** with admin credentials
2. **Redirected** to `/admin` dashboard
3. **Sidebar Navigation**:
   - Dashboard
   - Templates
   - Submissions

### Creating a Template

#### Step-by-Step Process

1. **Navigate to Templates**
   - Click "Templates" in sidebar
   - Click "Create New Template" button

2. **Enter Template Details**
   - **Template Name**: Unique identifier (e.g., `project-brief-v1`)
   - **Title**: Display name (e.g., "Project Brief Template")

3. **Add Sections**
   - Click "Add Section"
   - Enter section name (e.g., "Project Overview")
   - Sections can be expanded/collapsed

4. **Add Field Groups**
   - Within a section, click "Add Field Group"
   - Enter fields heading (e.g., "Basic Information")

5. **Add Fields**
   - Within a field group, click "Add Field"
   - Configure field:
     - **Input Name**: `projectName`
     - **Data Type**: `String`
     - **Field Type**: `input`
     - **Prompt** (optional): "Extract the project name or title"
     - **Helper Text** (optional): "Enter the official project name"

6. **Configure AI Fields**
   - For AI-enabled fields, add a detailed prompt
   - Example prompts:
     ```
     Budget: "Extract the total project budget or cost estimate"
     Timeline: "Find the project duration, start date, and end date"
     Stakeholders: "List all stakeholders, clients, or team members mentioned"
     ```

7. **Add Dropdown Options**
   - For dropdown fields, add comma-separated options
   - Example: `High,Medium,Low` for priority field

8. **Save Template**
   - Click "Create Template"
   - Template now available to all clients

### Managing Templates

#### Viewing Templates
- Navigate to **Admin → Templates**
- View all templates with submission counts
- Click template to view details

#### Editing Templates
- Click "Edit" on template card
- Modify sections, fields, or configuration
- Save changes

#### Deleting Templates
- Click "Delete" on template card
- Confirm deletion
- ⚠️ **Warning**: This will affect all briefs using this template

### Monitoring Submissions

#### Dashboard Overview
- Navigate to **Admin → Dashboard**
- View key metrics:
  - Total templates created
  - Total user submissions
  - Engagement statistics
  - Recent activity

#### Viewing All Submissions
- Navigate to **Admin → Submissions**
- See all templates with submission counts
- Click template to view user list

#### Viewing User Submission
- Select template → Select user
- View complete submission with:
  - All field values
  - AI confidence scores
  - Source indicators (AI vs Manual)
  - Timestamps

#### Exporting Submissions
- Click "Download PDF" on submission view
- PDF generated with all submission data

### Best Practices for Admins

1. **Template Naming**
   - Use descriptive, unique names
   - Include version numbers (e.g., `brief-v2`)
   - Avoid special characters

2. **Field Organization**
   - Group related fields together
   - Use clear section names
   - Limit fields per section (5-10 recommended)

3. **AI Prompts**
   - Be specific and detailed
   - Include context and examples
   - Test with sample documents

4. **Field Types**
   - Use `textarea` for long text
   - Use `dropdown` for predefined options
   - Use `input` for short text

5. **Helper Text**
   - Provide clear instructions
   - Include examples
   - Mention required formats

---

## 👤 User Guide

### Getting Started as a Client

1. **Login**
   - Navigate to application URL
   - Enter email and password
   - Or click "Create account" to register

2. **Dashboard**
   - View your dashboard at `/dashboard`
   - See available templates
   - Access quick actions

### Creating a Brief

#### Step 1: Select Template

1. Navigate to **Templates** in sidebar
2. Browse available templates
3. Click on desired template
4. Brief automatically created

#### Step 2: Fill Brief Sections

1. **Section Navigation**
   - Use tabs at top to switch sections
   - Current section highlighted in green
   - Progress indicator shows section number

2. **Manual Entry**
   - Click on any field to enter data
   - Changes saved locally
   - Click "Save Section" to persist

3. **AI-Powered Fill** (if available)
   - Look for "AI-Powered Section Fill" card
   - Upload relevant documents
   - Click "Generate with AI"
   - Review and edit AI-generated values

#### Step 3: Upload Documents

1. **Drag & Drop**
   - Drag files into upload area
   - Or click to browse files

2. **Supported Formats**
   - PDF documents
   - PowerPoint presentations
   - Excel spreadsheets
   - Word documents

3. **Upload Confirmation**
   - Green checkmark indicates success
   - Files listed below upload area
   - Delete icon to remove files

#### Step 4: AI Generation

1. **Prerequisites**
   - At least one document uploaded
   - Section has AI-enabled fields

2. **Generate**
   - Click "Generate with AI" button
   - Wait for processing (may take 10-30 seconds)
   - Success notification appears

3. **Review Results**
   - AI-generated fields show sparkle icon
   - Confidence score displayed (if available)
   - Edit any incorrect values

#### Step 5: Save Progress

1. **Save Section**
   - Click "Save Section" button
   - Confirmation notification
   - Data persisted to backend

2. **Navigate Sections**
   - Click "Continue →" to next section
   - Or use section tabs
   - "← Previous" to go back

#### Step 6: Generate PDF

1. **Complete All Sections**
   - Fill required fields
   - Save each section

2. **Generate PDF**
   - On final section, click "Generate PDF"
   - PDF opens in new tab
   - Review and download

### Understanding Field Indicators

| Indicator | Meaning |
|-----------|---------|
| 🌟 Sparkle icon | AI-generated value |
| ✅ Green badge | High confidence (>80%) |
| ⚠️ Yellow badge | Medium confidence (50-80%) |
| ❌ Red badge | Low confidence (<50%) |
| 📝 Manual icon | User-entered value |

### Tips for Best Results

1. **Document Quality**
   - Upload clear, readable documents
   - Ensure text is not scanned/image-based
   - Multiple documents improve accuracy

2. **AI Generation**
   - Review all AI-generated values
   - Edit incorrect or incomplete data
   - Save after making changes

3. **Field Completion**
   - Fill all required fields
   - Use helper text as guidance
   - Contact admin if unclear

4. **Saving Work**
   - Save sections regularly
   - Don't rely on auto-save
   - Confirm save notifications

---

## 🔌 API Integration

### Base API Client

Located in `lib/api/api.ts`, provides centralized HTTP communication:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URI;

// Automatic JWT token injection
// Error handling and parsing
// Type-safe responses
```

### API Services

#### Authentication API (`lib/api/auth.ts`)

```typescript
authService.login({ email, password })
authService.register({ name, email, password })
```

#### Template API (`lib/api/template.ts`)

```typescript
templateService.getTemplates()
templateService.getTemplateByName(templateName)
templateService.createBriefFromTemplate(templateData)
templateService.updateBriefFromTemplate(templateData)
```

#### Brief API (`lib/api/brief.ts`)

```typescript
briefService.getBrief(briefId)
briefService.updateFieldValue(briefId, fieldId, value)
briefService.uploadFile(briefId, sectionId, file)
briefService.generateSectionValues({ sectionId, s3Keys })
briefService.fillSection(sectionId, fieldValues)
briefService.deleteDocument(documentId)
```

#### Submissions API (`lib/api/submissions.ts`)

```typescript
submissionsService.getTemplateSubmissions()
submissionsService.getTemplateSubmissionById(templateId)
submissionsService.getUserSubmission(templateId, userId)
```

### API Response Types

All API responses are typed using TypeScript interfaces:

- `LoginResponse`, `RegisterResponse` - Authentication
- `Template`, `Section`, `InputField` - Template structure
- `Brief`, `BriefSection`, `BriefField` - Brief data
- `FieldValue` - Field value with metadata
- `TemplateSubmission` - Submission data

---

## 💻 Development Guidelines

### Code Organization

1. **Components**
   - One component per file
   - Use functional components with hooks
   - Props typed with TypeScript interfaces

2. **API Calls**
   - Always use service layer (`lib/api/`)
   - Never call `fetch` directly in components
   - Handle errors with try-catch

3. **State Management**
   - Use `useState` for local state
   - Use custom hooks for reusable logic
   - Lift state when shared across components

4. **Styling**
   - Use Tailwind CSS utility classes
   - Follow existing color scheme
   - Maintain responsive design

### TypeScript Best Practices

```typescript
// ✅ Good: Explicit types
interface Props {
  userId: string;
  onSubmit: (data: FormData) => void;
}

// ❌ Bad: Any types
interface Props {
  userId: any;
  onSubmit: any;
}
```

### Component Structure

```typescript
'use client'; // If using client-side features

import React, { useState } from 'react';
import { ComponentProps } from '@/types';

export function MyComponent({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState<string>('');

  const handleAction = () => {
    // Logic here
  };

  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

### Error Handling

```typescript
try {
  const data = await apiService.fetchData();
  toast.success('Success!');
} catch (err: any) {
  toast.error('Failed', {
    description: err.message
  });
}
```

### Adding New Features

1. **Create Types** (`lib/types/` or `types/`)
2. **Create API Service** (`lib/api/`)
3. **Create Component** (`components/`)
4. **Create Page** (`app/`)
5. **Update Middleware** (if protected route)
6. **Test Thoroughly**

---

## 🚢 Deployment

### Production Build

```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_BASE_URI=https://api.yourbackend.com
```

### Deployment Platforms

#### Vercel (Recommended)

1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

#### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional Hosting

1. Build application: `npm run build`
2. Copy `.next`, `public`, `package.json`, `node_modules`
3. Run `npm start` on server

### Performance Optimization

- Enable Next.js image optimization
- Use dynamic imports for large components
- Implement route-based code splitting
- Enable compression middleware

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **API Connection Failed**

**Symptom**: "Failed to fetch" errors

**Solution**:
- Check `NEXT_PUBLIC_API_BASE_URI` in `.env`
- Verify backend is running
- Check CORS configuration on backend
- Inspect network tab in browser DevTools

#### 2. **Authentication Issues**

**Symptom**: Redirected to login repeatedly

**Solution**:
- Clear cookies and localStorage
- Check JWT token expiry
- Verify middleware configuration
- Check backend authentication endpoint

#### 3. **File Upload Fails**

**Symptom**: Upload errors or stuck uploading

**Solution**:
- Check file size limits
- Verify S3 credentials on backend
- Check signed URL expiration
- Inspect network requests

#### 4. **AI Generation Not Working**

**Symptom**: No values generated or errors

**Solution**:
- Verify documents uploaded successfully
- Check backend Google AI API key
- Ensure fields have prompts configured
- Review backend logs for errors

#### 5. **PDF Generation Fails**

**Symptom**: PDF doesn't open or errors

**Solution**:
- Check browser popup blocker
- Verify brief data is complete
- Check console for errors
- Try different browser

### Debug Mode

Enable detailed logging:

```typescript
// In lib/api/api.ts
console.log('API Request:', endpoint, options);
console.log('API Response:', response);
```

### Getting Help

1. **Check Console**: Browser DevTools → Console tab
2. **Network Tab**: Inspect API requests/responses
3. **Backend Logs**: Check backend server logs
4. **Documentation**: Review this README
5. **Contact Admin**: Reach out to system administrator

---

## 📚 Additional Resources

### Related Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Backend Repository
- Ensure backend API is running and accessible
- Backend should handle authentication, AI processing, and S3 storage

### Support
For technical support or questions:
- Review this documentation
- Check troubleshooting section
- Contact your system administrator

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🎉 Conclusion

The GPJ Input Assistant frontend provides a powerful, user-friendly interface for AI-powered brief generation. With role-based access, intuitive workflows, and seamless AI integration, it streamlines the brief creation process for both administrators and clients.

**For Admins**: Create flexible templates, monitor submissions, and gain insights into user activity.

**For Users**: Leverage AI to auto-fill briefs, upload documents, and generate professional PDFs with minimal effort.

Happy brief building! 🚀
