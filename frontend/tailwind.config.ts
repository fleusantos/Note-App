import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inria': ['var(--font-inria-serif)'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'memo-brown': '#957139',
      },
      fontSize: {
        'note-sm': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'note-sm-bold': ['12px', { lineHeight: '1.5', fontWeight: '700' }],
        'note-title': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
export default config;
