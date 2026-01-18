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

      {/* Modern Footer */}
      <footer className="relative mt-auto border-t border-border/50 bg-gradient-to-b from-background to-muted/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-primary-foreground">G</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">GameHub</h3>
                  <p className="text-xs text-muted-foreground">Play & Connect</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Platform chơi game trực tuyến hàng đầu. Kết nối, thi đấu và chinh phục thử thách cùng bạn bè.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Liên kết nhanh</h4>
              <ul className="space-y-2">
                {['Trang chủ', 'Games', 'Bảng xếp hạng', 'Tin nhắn'].map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:scale-150 transition-transform"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Kết nối với chúng tôi</h4>
              <div className="flex gap-3">
                {[
                  { name: 'GitHub', icon: '💻', link: '#' },
                  { name: 'Discord', icon: '💬', link: '#' },
                  { name: 'Twitter', icon: '🐦', link: '#' },
                  { name: 'YouTube', icon: '▶️', link: '#' }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg group"
                    title={social.name}
                  >
                    <span className="text-xl group-hover:scale-125 transition-transform">{social.icon}</span>
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                📧 contact@gamehub.com<br/>
                🌐 www.gamehub.com
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-border/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 <span className="font-semibold text-foreground">Nhóm PTUDW</span>. All rights reserved.
              </p>
              <div className="flex gap-6 text-xs text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </footer>
    </div>
  );
}
