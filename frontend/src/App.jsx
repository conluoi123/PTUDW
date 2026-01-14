import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { WelcomePage } from './components/pages/WelcomePage';
import { ThemeProvider } from './contexts/ThemeContext';
import { MessagesPage } from './components/pages/MessagePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/messages" element={<MessagesPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
