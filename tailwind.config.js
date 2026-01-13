/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Marka rengi — UI'da accent olarak kullanılan tek bir renk paleti.
        // Kendi projende `bg-brand-500` / `text-brand-600` ile referans veriyorsun.
        brand: {
          50: '#eef5ff',
          100: '#d9e7ff',
          200: '#bcd4ff',
          300: '#8eb8ff',
          400: '#5a91ff',
          500: '#3b6cf5',
          600: '#274eda',
          700: '#1f3eaf',
          800: '#1d358a',
          900: '#1c306d',
          950: '#141e44',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
