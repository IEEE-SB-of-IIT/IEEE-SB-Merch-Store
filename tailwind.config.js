/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./context/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-druk)', 'sans-serif'],
                mono: ['var(--font-space)', 'monospace'],
                secondary: ['var(--font-space-mono)', 'monospace'],
                bebas: ['var(--font-druk)', 'sans-serif'],
                // Legacy CodeSprint font aliases — remapped to CS11 official fonts
                // so older surfaces (checkout, cart) match codesprint.lk.
                mortend: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
                tommy: ['var(--font-rajdhani)', 'Rajdhani', 'sans-serif'],
                // CodeSprint 11 official fonts
                garamond: ['var(--font-garamond)', 'EB Garamond', 'Georgia', 'serif'],
                rajdhani: ['var(--font-rajdhani)', 'Rajdhani', 'sans-serif'],
                manrope: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
            },
            colors: {
                // Arctic Theme Colors (IEEE Blue Edition)
                arctic: {
                    base: '#004B76',
                    dark: '#002F4B',
                    light: '#E2E8F0',
                    blue: '#4091C2',
                    cyan: '#00629B',
                },
                // Legacy CodeSprint aliases — remapped to the CS11 palette so older
                // surfaces (checkout, cart drawer) match codesprint.lk without rewrites.
                cs: {
                    midnight: '#000000',   // → cs11 pure black
                    coral:    '#ff6a3d',   // → cs11 orange
                    amber:    '#ffc371',   // → cs11 gold
                    storm:    '#4A5059',
                    mist:     '#EAECEF',
                },
                // ── CodeSprint 11 official dark theme tokens ──
                cs11: {
                    bg:       '#000000',       // pure black background
                    surface:  '#0a0a0a',       // slightly lifted surface
                    card:     '#111111',       // dark card bg
                    border:   'rgba(255,255,255,0.08)',  // subtle white border
                    orange:   '#ff6a3d',       // primary accent (CS11 brand)
                    gold:     '#ffc371',       // warm gradient end
                    orangeDeep: '#ff7200',     // deep orange glow
                    cyan:     '#00ffcc',       // status dots
                    textPrimary:  '#ffffff',
                    textMuted:    'rgba(255,255,255,0.5)',
                    textDim:      'rgba(255,255,255,0.25)',
                    label:    'rgba(255,106,61,0.7)',   // section label color
                }
            },
        },
    },
    plugins: [],
};
