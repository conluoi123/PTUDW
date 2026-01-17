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
import { ProfilePage } from './components/pages/ProfilePage';
function App() {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<MainLayout />}>
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
}

export default App;
