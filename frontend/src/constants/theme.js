/**
 * Theme Constants
 * 
 * This file contains all color and styling constants used throughout the application.
 * All colors should reference CSS variables defined in index.css for proper theme support.
 * 
 * Usage:
 * import { COLORS, GRADIENTS } from '@/constants/theme';
 * <div className={COLORS.card}>...</div>
 */

export const COLORS = {
    // Background colors
    background: 'bg-background',
    card: 'bg-card',
    popover: 'bg-popover',

    // Text colors
    foreground: 'text-foreground',
    cardForeground: 'text-card-foreground',
    popoverForeground: 'text-popover-foreground',
    muted: 'text-muted-foreground',

    // Interactive colors
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground',

    // Form elements
    input: 'bg-input border-border',

    // Borders
    border: 'border-border',
};

export const GRADIENTS = {
    // Primary gradient (purple to pink)
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600',
    primaryHover: 'hover:from-purple-500 hover:to-pink-500',

    // Subtle gradients for backgrounds
    cardGlow: 'bg-gradient-to-br from-primary/5 via-transparent to-accent/5',
};

export const SHADOWS = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    primary: 'shadow-lg shadow-primary/20',
    primaryHover: 'hover:shadow-purple-500/50',
};

export const TRANSITIONS = {
    default: 'transition-all duration-200',
    slow: 'transition-all duration-300',
    fast: 'transition-all duration-150',
    colors: 'transition-colors duration-200',
};

export const BUTTON_VARIANTS = {
    primary: `${COLORS.primary} ${SHADOWS.md} ${GRADIENTS.primary} ${GRADIENTS.primaryHover} ${SHADOWS.primaryHover} ${TRANSITIONS.default} border-0`,
    secondary: `${COLORS.secondary} hover:bg-secondary/80 ${TRANSITIONS.default}`,
    ghost: `hover:bg-accent hover:text-accent-foreground ${TRANSITIONS.default}`,
    outline: `border ${COLORS.border} bg-background hover:bg-accent hover:text-accent-foreground ${TRANSITIONS.default}`,
};

export const INPUT_VARIANTS = {
    default: `${COLORS.input} focus-visible:border-primary focus-visible:ring-primary/20 ${TRANSITIONS.colors}`,
    error: `${COLORS.input} border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20`,
};

/**
 * Game-specific colors
 * These are special colors for game boards and elements
 */
export const GAME_COLORS = {
    board: 'bg-card/95 backdrop-blur-lg',
    cell: 'bg-accent hover:bg-accent/80',
    cellActive: 'bg-primary text-primary-foreground',
};

/**
 * Status colors
 * For badges, alerts, and status indicators
 */
export const STATUS_COLORS = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    inactive: 'bg-muted text-muted-foreground',
};

/**
 * Layout constants
 */
export const LAYOUT = {
    header: 'h-16',
    sidebar: {
        collapsed: 'w-20',
        expanded: 'w-56 sm:w-64',
    },
    maxWidth: 'max-w-screen-2xl',
    padding: {
        sm: 'px-4 sm:px-6 lg:px-8',
        page: 'px-4 sm:px-6 lg:px-8 py-6 sm:py-8',
    },
};
