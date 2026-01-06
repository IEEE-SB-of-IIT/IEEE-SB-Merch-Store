"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, Theme } from '../constants/themes';

interface ThemeContextType {
    currentEvent: string;
    theme: Theme;
    switchEvent: (eventId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [currentEvent, setCurrentEvent] = useState<string>('general');

    const switchEvent = (eventId: string) => {
        if (themes[eventId]) {
            setCurrentEvent(eventId);
        }
    };

    const theme = themes[currentEvent];

    // Update CSS Variables when theme changes
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--background-color', theme.colors.background);
        root.style.setProperty('--text-color', theme.colors.text);
        root.style.setProperty('--text-secondary', theme.colors.textSecondary);
        root.style.setProperty('--accent-color', theme.colors.accent);
        root.style.setProperty('--header-bg', theme.colors.headerBg);

        // Apply variable fonts
        root.style.setProperty('--font-main', theme.fonts.main);
        root.style.setProperty('--font-heading', theme.fonts.heading);

    }, [currentEvent, theme]);

    return (
        <ThemeContext.Provider value={{ currentEvent, theme, switchEvent }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
