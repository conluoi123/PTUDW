import { useState, useMemo, useCallback } from 'react';
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

function AppContent() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [authPage, setAuthPage] = useState(null);
  const [user, setUser] = useState(null);

  const handlePlayGame = useCallback((gameType) => {
    setCurrentGame(gameType);
    setIsSidebarOpen(false);
  }, []);

  const handleBackToGames = useCallback(() => {
    setCurrentGame(null);
    setCurrentPage('games');
  }, []);

  const handleMenuClick = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleLogin = useCallback((email, password) => {
    // Mock login - in production, this would call an API
    const mockUser = {
      name: email.split('@')[0],
      email: email,
      avatar: undefined
    };
    setUser(mockUser);
    setAuthPage(null);
    setCurrentPage('home');
  }, []);

  const handleRegister = useCallback((name, email, password) => {
    // Mock register - in production, this would call an API
    const mockUser = {
      name: name,
      email: email,
      avatar: undefined
    };
    setUser(mockUser);
    setAuthPage(null);
    setCurrentPage('home');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentPage('home');
  }, []);

  const handleShowLogin = useCallback(() => {
    setAuthPage('login');
  }, []);

  const handleShowRegister = useCallback(() => {
    setAuthPage('register');
  }, []);

  const handleBackFromAuth = useCallback(() => {
    setAuthPage(null);
  }, []);

  const renderGame = useMemo(() => {
    switch (currentGame) {
      case 'caro5':
        return <CaroGame onBack={handleBackToGames} winCondition={5} />;
      case 'caro4':
        return <CaroGame onBack={handleBackToGames} winCondition={4} />;
      case 'tictactoe':
        return <TicTacToeGame onBack={handleBackToGames} />;
      case 'candycrush':
        return <CandyCrushGame onBack={handleBackToGames} />;
      case 'snake':
        return <SnakeGame onBack={handleBackToGames} />;
      default:
        return null;
    }
  }, [currentGame, handleBackToGames]);

  const renderPage = useMemo(() => {
    // Show WelcomePage if not logged in and on home page
    if (!user && currentPage === 'home') {
      return (
        <WelcomePage
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
          onViewGames={() => setCurrentPage('games')}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'games':
        return <GamesPage onPlayGame={handlePlayGame} />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'achievements':
        return <AchievementsPage />;
      case 'ranking':
        return <RankingPage />;
      case 'admin':
        return <AdminPage />;
      case 'friends':
        return <FriendsPage />;
      case 'messages':
        return <MessagesPage />;
      default:
        return <HomePage />;
    }
  }, [currentPage, handlePlayGame, user, handleShowLogin, handleShowRegister]);

  const renderAuthPage = useMemo(() => {
    switch (authPage) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={handleShowRegister}
            onBack={handleBackFromAuth}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={handleShowLogin}
            onBack={handleBackFromAuth}
          />
        );
      default:
        return null;
    }
  }, [authPage, handleLogin, handleRegister, handleShowLogin, handleShowRegister, handleBackFromAuth]);

  // Don't show header and sidebar when in game mode or auth page or not logged in
  const isGameMode = currentGame !== null;
  const isAuthMode = authPage !== null;
  const isLoggedIn = !!user;
  const showNavigation = !isGameMode && !isAuthMode && isLoggedIn;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      {/* Auth Pages (fullscreen) */}
      {authPage ? (
        renderAuthPage
      ) : !isLoggedIn ? (
        /* Welcome Page for guests (fullscreen) */
        <WelcomePage
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
          onViewGames={() => { }} // Do nothing, stay on welcome page
        />
      ) : (
        /* Main App for logged in users */
        <>
          {/* Header */}
          {showNavigation && (
            <Header
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              onMenuClick={handleMenuClick}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onPlayGame={handlePlayGame}
              user={user}
              onLogout={handleLogout}
              onShowLogin={handleShowLogin}
              onShowRegister={handleShowRegister}
            />
          )}

          <div className="flex">
            {/* Sidebar */}
            {showNavigation && (
              <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isOpen={isSidebarOpen}
                onClose={handleSidebarClose}
                isLoggedIn={isLoggedIn}
                onShowLogin={handleShowLogin}
              />
            )}

            {/* Main Content */}
            <main className={`
                flex-1 transition-all duration-300 
                ${showNavigation ? 'pt-16 lg:ml-20' : ''} 
                min-h-screen
              `}>
              {isGameMode ? (
                renderGame
              ) : (
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-screen-2xl mx-auto">
                  {renderPage}
                </div>
              )}
            </main>
          </div>

          {/* Overlay for mobile */}
          {isSidebarOpen && showNavigation && (
            <div
              className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
              onClick={handleSidebarClose}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}