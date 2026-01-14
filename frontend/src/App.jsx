import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { WelcomePage } from './components/pages/WelcomePage';
import { ThemeProvider } from './contexts/ThemeContext';


function App() {
    return (
        <ThemeProvider>
            <WelcomePage />
        </ThemeProvider>
    );
}

export default App;
