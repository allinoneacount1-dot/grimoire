import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void:    '#07050A',
        deep:    '#0F0B14',
        surface: '#16111E',
        elevated:'#1F1828',
        gold: {
          bright: '#D4A843',
          dim:    '#8A6C28',
          ghost:  '#2A2010',
        },
        rose: {
          bright: '#C4546A',
          dim:    '#7A3344',
          ghost:  '#1E0B0F',
        },
        positive: '#4E8C6A',
        negative: '#8C3E4A',
        parchment: '#E4DDD6',
        muted:    '#8A7F76',
        neutral:  '#505060',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'Consolas', 'monospace'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '8px',
      },
      animation: {
        'count-up':   'countUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':    'fadeIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'blink':      'blink 1.2s step-end infinite',
        'shimmer':    'shimmer 2s infinite',
      },
      keyframes: {
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
