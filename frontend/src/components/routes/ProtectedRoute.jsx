import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const hasStoredUser = !!localStorage.getItem('userId');

    // If no user in local storage and not authenticated, fail fast
    if (!hasStoredUser && !isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (isLoading) {
        return <LoadingOverlay message="Checking Info" description="Please wait..." />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
