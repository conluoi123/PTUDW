import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WelcomePage } from './components/pages/WelcomePage';
import { ThemeProvider } from './contexts/ThemeContext';
import { MessagesPage } from './components/pages/MessagePage';
import { HomePage } from './components/pages/HomePage';
import { MainLayout } from './components/layouts/MainLayout';
import { AchievementsPage } from './components/pages/AchievementsPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import { RankingPage } from './components/pages/RankingPage';
import { AdminPage } from './components/pages/AdminPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { GamesPage } from './components/pages/GamePage';
import { DrawingBoardGame } from './components/games/DrawingBoardGame';
import { AdminRoute } from './components/auth/AdminRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';
import GuestRoute from './components/routes/GuestRoute';
import { FriendsPage } from './components/pages/FriendsPage';
import { MemoryCardGame } from './components/games/MemoryCardGame';
import { Caro5 } from './components/games/Caro5';
import { Caro4 } from './components/games/Caro4';
function App() {
  
    return (
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes (Guest Only) */}
              <Route element={<GuestRoute />}>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected Routes (User Only) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  } 
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/games/drawing-board" element={<DrawingBoardGame />} />
                <Route path="/games/memory-card" element={<MemoryCardGame />} />
                <Route path="/games/caro-5" element={<Caro5 />} />
                <Route path="/games/caro-4" element={<Caro4 />} />
              </Route>
              </Route>  
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
}

export default App;
