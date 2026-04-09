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

export const themes: Record<string, Theme> = {
    general: {
        id: 'general',
        name: 'General',
        colors: {
            // primary: '#00629B', // IEEE Blue
            primary: '#00f3ff', // Next Gen Cyan for primary actions
            background: '#004B76', // Arctic Base
            text: '#ffffff',
            textSecondary: '#9ca3af', // gray-400
            accent: '#171717', // neutral-900
            headerBg: 'rgba(0, 75, 118, 0.8)',
        },
        fonts: {
            main: 'var(--font-outfit)',
            heading: 'var(--font-outfit)',
            secondary: 'var(--font-space-mono)',
        }
    },
    codesprint: {
        id: 'codesprint',
        name: 'Codesprint',
        colors: {
            primary: '#ff5b41',    // Dream Coral — CTA / accent
            background: '#151922', // Midnight Slate — primary bg
            text: '#EAECEF',       // Mist White — body text
            textSecondary: '#4A5059', // Storm Gray — secondary text / borders
            accent: '#F2A265',     // Sunset Amber — hover / gradient
            headerBg: 'rgba(21, 25, 34, 0.85)',
        },
        fonts: {
            main: 'var(--font-tommy)',
            heading: 'Mortend, var(--font-druk), sans-serif',
            secondary: 'var(--font-tommy)',
        }
    },
    ix: {
        id: 'ix',
        name: 'IX',
        colors: {
            primary: '#bc13fe', // Neon Magenta
            background: '#450a25', // Deep Purple
            text: '#ffffff',
            textSecondary: '#e5e7eb', // gray-200
            accent: '#1a0525', // Dark purple accent
            headerBg: 'rgba(69, 10, 37, 0.9)',
        },
        fonts: {
            main: 'var(--font-outfit)',
            heading: 'var(--font-outfit)',
            secondary: 'var(--font-space-mono)',
        }
    }
};
