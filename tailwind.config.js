/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-druk)', 'sans-serif'],
                mono: ['var(--font-space)', 'monospace'],
                spray: ['var(--font-aerosoldier)', 'sans-serif'],
                courier: ['var(--font-courier)', 'monospace'],
                secondary: ['var(--font-space-mono)', 'monospace'],
                bebas: ['var(--font-druk)', 'sans-serif'], // Mapping existing usage to new main font
                system: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            colors: {
                // Base colors
                background: '#ffffff',
                foreground: '#0f172a', // slate-900

                // Brand
                primary: '#2563eb', // blue-600
                secondary: '#475569', // slate-600
                accent: '#f1f5f9', // slate-100

                // Specifics
                ieee: {
                    blue: '#00629B',
                    dark: '#000000',
                },

                // Arctic Theme Colors
                // Arctic Theme Colors (IEEE Blue Edition)
                arctic: {
                    base: '#004B76', // Muted IEEE Blue
                    dark: '#002F4B', // Darker navy-like blue
                    light: '#E2E8F0', // Text/Accents
                    blue: '#4091C2', // Lighter blue accent
                    cyan: '#00629B', // IEEE Bright Blue for highlights
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-mesh': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(340,100%,76%,1) 0px, transparent 50%)',
            }
        },
    },
    plugins: [],
};
