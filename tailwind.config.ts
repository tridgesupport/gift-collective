import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                cream: 'var(--cream)',
                sand: 'var(--sand)',
                'warm-dark': 'var(--warm-dark)',
                gold: 'var(--gold)',
                muted: 'var(--muted)',
            },
            fontFamily: {
                cormorant: ['var(--font-cormorant)', 'serif'],
                jost: ['var(--font-jost)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
export default config
