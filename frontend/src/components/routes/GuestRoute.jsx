import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

const GuestRoute = () => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const hasStoredUser = !!localStorage.getItem('userId');

    // If user in local storage, assume logged in (or waiting to verify) and redirect to home
    // This prevents seeing login page while loading
    if (hasStoredUser) {
        return <Navigate to="/home" replace />;
    }

    // if (isLoading) {
    //     return <LoadingOverlay message="Checking Info" description="Please wait..." />;
    // }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/home" replace />;
};

export default GuestRoute;
