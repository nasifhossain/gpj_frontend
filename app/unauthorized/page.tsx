import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        You do not have permission to access the requested page.
                    </p>
                </div>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                    <Link href="/login">
                        <Button variant="primary">Return to Login</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
