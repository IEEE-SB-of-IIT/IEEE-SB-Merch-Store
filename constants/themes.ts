export interface ThemeColors {
    primary: string;
    background: string;
    text: string;
    textSecondary: string;
    accent: string;
    headerBg: string;
}

export interface ThemeFonts {
    main: string;
    heading: string;
    secondary: string;
}

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
}

// CodeSprint 11 is the only storefront — single theme, matching codesprint.lk.
export const themes: Record<string, Theme> = {
    codesprint: {
        id: 'codesprint',
        name: 'Codesprint',
        colors: {
            primary: '#ff6a3d',    // CS11 orange — CTA / primary actions
            background: '#000000', // Pure black — codesprint.lk base
            text: '#ffffff',
            textSecondary: 'rgba(255, 255, 255, 0.5)',
            accent: '#ff6a3d',     // CS11 orange accent
            headerBg: 'rgba(0, 0, 0, 0.8)',
        },
        fonts: {
            main: 'var(--font-manrope)',
            heading: 'var(--font-garamond)',
            secondary: 'var(--font-rajdhani)',
        }
    },
};
