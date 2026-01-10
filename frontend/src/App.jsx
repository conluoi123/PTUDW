import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WelcomePage } from './components/pages/WelcomePage';
import { HomePage } from './components/pages/HomePage';
import { GamesPage } from './components/pages/GamesPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AchievementsPage } from './components/pages/AchievementsPage';
import { RankingPage } from './components/pages/RankingPage';
import { AdminPage } from './components/pages/AdminPage';
import { FriendsPage } from './components/pages/FriendsPage';
import { MessagesPage } from './components/pages/MessagesPage';
import { CaroGame } from './components/games/CaroGame';
import { TicTacToeGame } from './components/games/TicTacToeGame';
import { CandyCrushGame } from './components/games/CandyCrushGame';
import { SnakeGame } from './components/games/SnakeGame';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

// --- MOCK AUTH HOOK ---
// Trong thực tế sẽ dùng Context
const useAuth = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email) => {
    const mockUser = {
      name: email.split('@')[0],
      email: email,
      avatar: undefined // hoặc link ảnh mẫu
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = (name, email) => {
    const mockUser = { name, email };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, login, logout, register };
};

// --- LAYOUT COMPONENT ---
// Chứa Header và Sidebar, chỉ hiện khi đã Login
function MainLayout({ user, logout }) {
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
        onLogout={() => {
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
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-screen-2xl mx-auto">
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

// --- GAME WRAPPERS ---
// Wrapper để xử lý nút Back trong game
function GameWrapper({ children }) {
    const navigate = useNavigate();
    // Clone element để inject prop onBack
    // Lưu ý: Cách này giả định children là 1 React Element valid chấp nhận onBack
    return (
        <div className="min-h-screen bg-background">
             {/* Bạn có thể render nút back tùy chỉnh ở đây nếu game không có sẵn */}
             {React.cloneElement(children, { onBack: () => navigate('/games') })}
        </div>
    )
}

// Vì các component Game hiện tại đang nhận props onBack,
// ta cần tạo component wrapper cụ thể để truyền navigate
const GameContainer = ({ Component, ...props }) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background">
            <Component onBack={() => navigate('/games')} {...props} />
        </div>
    );
};


function AppContent() {
  const { user, login, logout, register } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            !user ? (
               <WelcomePage 
                 onShowLogin={() => window.location.href='/login'} // Hoặc dùng useNavigate bên trong WelcomePage
                 onShowRegister={() => window.location.href='/register'}
                 onViewGames={() => {}}
               />
            ) : <Navigate to="/home" replace />
          } 
        />
        
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={login} onSwitchToRegister={null} onBack={null} /> : <Navigate to="/home" />} 
        />
        <Route 
            path="/register" 
            element={!user ? <RegisterPage onRegister={register} onSwitchToLogin={null} onBack={null} /> : <Navigate to="/home" />} 
        />

        {/* Protected Routes (Main Layout) */}
        {user && (
          <Route element={<MainLayout user={user} logout={logout} />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/games" element={<GamesPage onPlayGame={(gameId) => window.location.href=`/play/${gameId}`}/>} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        )}

        {/* Game Routes (Full Screen) */}
        {user && (
            <>
                <Route path="/play/caro5" element={<GameContainer Component={CaroGame} winCondition={5} />} />
                <Route path="/play/caro4" element={<GameContainer Component={CaroGame} winCondition={4} />} />
                <Route path="/play/tictactoe" element={<GameContainer Component={TicTacToeGame} />} />
                <Route path="/play/candycrush" element={<GameContainer Component={CandyCrushGame} />} />
                <Route path="/play/snake" element={<GameContainer Component={SnakeGame} />} />
            </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Cần import React để dùng React.cloneElement (hoặc sửa lại GameContainer)
import React from 'react';

export default function App() {
  return (
    <ThemeProvider>
        <AppContent />
    </ThemeProvider>
  );
}