/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          overlay: 'var(--surface-overlay)',
        },
        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        brand: {
          DEFAULT: '#4F7FFF',
          light: '#7AAEFF',
          dark: '#2E5FDF',
        },
        'team-a': '#3B82F6',
        'team-b': '#EF4444',
      },
      backgroundImage: {
        'card-special': 'linear-gradient(155deg, #7B5800 0%, #C8960C 18%, #FFD700 42%, #FFF0A0 52%, #DAA520 75%, #8B6914 100%)',
        'card-gold': 'linear-gradient(155deg, #5A4200 0%, #8B6914 18%, #C8A030 42%, #E8C060 52%, #B89020 75%, #6B5010 100%)',
        'card-silver': 'linear-gradient(155deg, #3A3A3A 0%, #787878 18%, #C8C8C8 42%, #ECECEC 52%, #909090 75%, #484848 100%)',
        'card-bronze': 'linear-gradient(155deg, #4A2800 0%, #7A4820 18%, #CD7F32 42%, #E8A060 52%, #9A5818 75%, #5A2810 100%)',
        'card-normal': 'linear-gradient(155deg, #0F1830 0%, #1A2848 18%, #263860 42%, #304878 52%, #1E3058 75%, #0F1830 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 8px rgba(79,127,255,0.3), 0 0 20px rgba(79,127,255,0.1)' },
          '100%': { boxShadow: '0 0 16px rgba(79,127,255,0.6), 0 0 40px rgba(79,127,255,0.2)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
