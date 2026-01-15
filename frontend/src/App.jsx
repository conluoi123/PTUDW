import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { WelcomePage } from './components/pages/WelcomePage';
import { ThemeProvider } from './contexts/ThemeContext';
import { MessagesPage } from './components/pages/MessagePage';
import { HomePage } from './components/pages/HomePage';
import { MainLayout } from './components/layouts/MainLayout';
import { AchievementsPage } from './components/pages/AchievementsPage';
function App() {
    // Mock user data for protected routes
    const mockUser = { name: "Player", avatar: "P" };
    const handleLogout = () => console.log("Logged out");

    return (
        <BrowserRouter>
            <ThemeProvider>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route element={<MainLayout user={mockUser} logout={handleLogout} />}>
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />

                    </Route>
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
