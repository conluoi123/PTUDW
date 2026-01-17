import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export function AdminRoute({ children }) {
    const { user, isLoading } = useContext(AuthContext);

    // Đang loading → show loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Checking permissions...</p>
                </div>
            </div>
        );
    }

    // Chưa login → redirect về login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Không phải admin → show 403 Forbidden
    if (user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="text-6xl">🚫</div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">403</h1>
                    <h2 className="text-xl text-gray-600 dark:text-gray-400">Access Denied</h2>
                    <p className="text-gray-500 dark:text-gray-500 max-w-md">
                        You don't have permission to access this page. Admin access required.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Là admin → cho vào
    return children;
}
