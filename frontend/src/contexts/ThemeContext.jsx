import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createMuiTheme } from '../theme/muiTheme';

const ThemeContext = createContext({
    isDarkMode: true,
    toggleDarkMode: () => { },
    theme: {},
    muiTheme: null
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage first, default to true (dark mode)
        const saved = localStorage.getItem('darkMode');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Create MUI theme based on dark mode
    const muiTheme = useMemo(() => createMuiTheme(isDarkMode), [isDarkMode]);

    useEffect(() => {
        // Apply theme class to document
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    // Theme configuration object for programmatic access
    const theme = {
        colors: {
            // These map to CSS variables defined in index.css
            background: 'var(--background)',
            foreground: 'var(--foreground)',
            card: 'var(--card)',
            cardForeground: 'var(--card-foreground)',
            popover: 'var(--popover)',
            popoverForeground: 'var(--popover-foreground)',
            primary: 'var(--primary)',
            primaryForeground: 'var(--primary-foreground)',
            secondary: 'var(--secondary)',
            secondaryForeground: 'var(--secondary-foreground)',
            muted: 'var(--muted)',
            mutedForeground: 'var(--muted-foreground)',
            accent: 'var(--accent)',
            accentForeground: 'var(--accent-foreground)',
            destructive: 'var(--destructive)',
            destructiveForeground: 'var(--destructive-foreground)',
            border: 'var(--border)',
            input: 'var(--input)',
            ring: 'var(--ring)',
        },
        // Tailwind class mappings for easy use
        classes: {
            background: 'bg-background text-foreground',
            card: 'bg-card text-card-foreground',
            popover: 'bg-popover text-popover-foreground',
            primary: 'bg-primary text-primary-foreground',
            secondary: 'bg-secondary text-secondary-foreground',
            muted: 'bg-muted text-muted-foreground',
            accent: 'bg-accent text-accent-foreground',
            destructive: 'bg-destructive text-destructive-foreground',
            input: 'bg-input border-border',
            button: {
                primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
            }
        }
    };

    const value = {
        isDarkMode,
        toggleDarkMode,
        theme,
        muiTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
