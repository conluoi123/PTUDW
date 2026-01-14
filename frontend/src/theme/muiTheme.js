import { createTheme } from '@mui/material/styles';

// Tạo theme theo phong cách Facebook
export const createMuiTheme = (isDarkMode) => {
    return createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',

            // Facebook Blue - Primary color
            primary: {
                main: isDarkMode ? '#2e89ff' : '#1877f2', // Facebook Blue
                light: isDarkMode ? '#5ba3ff' : '#42a5f5',
                dark: isDarkMode ? '#0066cc' : '#0c63d4',
                contrastText: '#ffffff',
            },

            // Green - Secondary color (like button, online status)
            secondary: {
                main: isDarkMode ? '#42b72a' : '#42b72a', // Facebook Green
                light: isDarkMode ? '#5ec94a' : '#66bb6a',
                dark: isDarkMode ? '#2d9618' : '#2e7d32',
                contrastText: '#ffffff',
            },

            // Background colors - Facebook style
            background: {
                default: isDarkMode ? '#18191a' : '#f0f2f5',
                paper: isDarkMode ? '#242526' : '#ffffff',
            },

            // Text colors
            text: {
                primary: isDarkMode ? '#e4e6eb' : '#050505',
                secondary: isDarkMode ? '#b0b3b8' : '#65676b',
            },

            // Additional Facebook colors
            error: {
                main: '#f02849',
            },
            warning: {
                main: '#ff9800',
            },
            info: {
                main: isDarkMode ? '#2e89ff' : '#1877f2',
            },
            success: {
                main: '#42b72a',
            },

            divider: isDarkMode ? '#3e4042' : '#e4e6eb',
        },

        typography: {
            fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',

            h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
            h2: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
            h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0em' },
            h4: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0em' },
            h5: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '0em' },
            h6: { fontSize: '1rem', fontWeight: 600, letterSpacing: '0em' },

            body1: {
                fontSize: '0.9375rem',
                letterSpacing: '0em',
                lineHeight: 1.3333,
            },
            body2: {
                fontSize: '0.875rem',
                letterSpacing: '0em',
            },

            button: {
                textTransform: 'none',
                fontWeight: 600,
                letterSpacing: '0em',
            },
        },

        shape: {
            borderRadius: 8, // Facebook bo góc vừa phải
        },

        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        padding: '8px 12px',
                        boxShadow: 'none',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        '&:hover': {
                            boxShadow: 'none',
                        },
                    },
                    contained: {
                        '&:hover': {
                            boxShadow: 'none',
                            filter: 'brightness(0.95)',
                        },
                    },
                    containedPrimary: {
                        backgroundColor: '#1877f2',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#166fe5',
                        },
                    },
                    containedSecondary: {
                        backgroundColor: '#42b72a',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#36a420',
                        },
                    },
                    outlined: {
                        borderWidth: '1px',
                        borderColor: isDarkMode ? '#3e4042' : '#ced0d4',
                        backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
                        color: isDarkMode ? '#e4e6eb' : '#050505',
                        '&:hover': {
                            borderColor: isDarkMode ? '#4e4f50' : '#bcc0c4',
                            backgroundColor: isDarkMode ? '#4e4f50' : '#d8dadf',
                        },
                    },
                    text: {
                        '&:hover': {
                            backgroundColor: isDarkMode ? '#3a3b3c' : '#f2f3f5',
                        },
                    },
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        boxShadow: isDarkMode
                            ? 'none'
                            : '0 1px 2px rgba(0, 0, 0, 0.1)',
                        border: isDarkMode ? '1px solid #3e4042' : 'none',
                        backgroundColor: isDarkMode ? '#242526' : '#ffffff',
                        transition: 'box-shadow 0.2s',
                        '&:hover': {
                            boxShadow: isDarkMode
                                ? '0 2px 8px rgba(0,0,0,0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        },
                    },
                },
            },

            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 6,
                            backgroundColor: isDarkMode ? '#3a3b3c' : '#f0f2f5',
                            '& fieldset': {
                                borderColor: 'transparent',
                                borderWidth: '1px',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? '#4e4f50' : '#ced0d4',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1877f2',
                                borderWidth: '1px',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? '#b0b3b8' : '#65676b',
                            '&.Mui-focused': {
                                color: '#1877f2',
                            },
                        },
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        backgroundColor: isDarkMode ? '#242526' : '#ffffff',
                    },
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                    },
                    filled: {
                        backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
                        color: isDarkMode ? '#e4e6eb' : '#050505',
                        '&:hover': {
                            backgroundColor: isDarkMode ? '#4e4f50' : '#d8dadf',
                        },
                    },
                },
            },

            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 8,
                        backgroundColor: isDarkMode ? '#242526' : '#ffffff',
                        boxShadow: isDarkMode
                            ? '0 12px 28px rgba(0,0,0,0.6)'
                            : '0 12px 28px rgba(0,0,0,0.15)',
                    },
                },
            },

            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: isDarkMode ? '#4e4f50' : '#4b4c4f',
                        fontSize: '0.75rem',
                        borderRadius: 6,
                        padding: '6px 8px',
                        fontWeight: 500,
                    },
                },
            },

            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                        height: 4,
                        backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
                    },
                    bar: {
                        borderRadius: 4,
                        backgroundColor: '#1877f2',
                    },
                },
            },

            MuiAvatar: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#1877f2',
                        color: '#ffffff',
                        fontWeight: 600,
                    },
                },
            },

            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor: isDarkMode ? '#3e4042' : '#e4e6eb',
                    },
                },
            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '50%',
                        '&:hover': {
                            backgroundColor: isDarkMode ? '#3a3b3c' : '#f2f3f5',
                        },
                    },
                },
            },

            MuiSwitch: {
                styleOverrides: {
                    switchBase: {
                        '&.Mui-checked': {
                            color: '#1877f2',
                            '& + .MuiSwitch-track': {
                                backgroundColor: '#1877f2',
                            },
                        },
                    },
                },
            },
        },

        // Custom shadows theo Facebook style
        shadows: [
            'none',
            isDarkMode
                ? 'none'
                : '0 1px 2px rgba(0, 0, 0, 0.1)',
            isDarkMode
                ? '0 2px 4px rgba(0,0,0,0.2)'
                : '0 1px 2px rgba(0, 0, 0, 0.1)',
            isDarkMode
                ? '0 2px 8px rgba(0,0,0,0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
            isDarkMode
                ? '0 4px 12px rgba(0,0,0,0.4)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
            isDarkMode
                ? '0 8px 16px rgba(0,0,0,0.5)'
                : '0 8px 16px rgba(0, 0, 0, 0.1)',
            ...Array(19).fill('none'),
        ],
    });
};
