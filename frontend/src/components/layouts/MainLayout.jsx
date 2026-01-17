import { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { userApi } from '@/services/userApi.services';

export function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định currentPage dựa trên URL để highlight sidebar
  const getCurrentPage = () => {
    const path = location.pathname.substring(1); // bỏ dấu /
    return path || 'home';
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPage={getCurrentPage()}
        user={user}
        onLogout={async () => {
          await userApi.logout();
          localStorage.removeItem("userId")
          logout();
          navigate('/');
        }}
        // Các props showLogin/Register ko cần nữa vì đã ở trong app
        onShowLogin={() => {}} 
        onShowRegister={() => {}}
      />

      <div className="flex">
        <Sidebar
          currentPage={getCurrentPage()}
          setCurrentPage={(page) => navigate(`/${page}`)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isLoggedIn={true}
        />

        <main className="flex-1 transition-all duration-300 pt-16 lg:ml-20 min-h-screen">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-screen-4xl mx-auto">
            <Outlet /> {/* Nơi render các page con */}
          </div>
        </main>
      </div>

       {/* Mobile Overlay */}
       {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
