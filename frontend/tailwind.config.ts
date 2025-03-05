import type { Config } from 'tailwindcss';

interface CreatePresetOptions {
  grid: 'bootstrap' | 'tailwind';
}

function createPreset({ grid }: CreatePresetOptions): Config {
  return {
    theme: {
      extend: {
        screens:
          grid === 'bootstrap'
            ? {
                sm: '576px',
                md: '768px',
                lg: '992px',
                xl: '1200px',
                '2xl': '1400px'
              }
            : undefined,
        container: {
          center: true,
          padding: '1rem'
        },
        colors: {
          primary: 'var(--bs-primary)',
          secondary: 'var(--bs-secondary)',
          tertiary: 'var(--bs-tertiary)',
          success: 'var(--bs-success)',
          info: 'var(--bs-info)',
          warning: 'var(--bs-warning)',
          danger: 'var(--bs-danger)',
          light: 'var(--bs-light)',
          dark: 'var(--bs-dark)'
        }
      }
    },
    content: [],
    blocklist: ['collapse'],
    corePlugins: {
      preflight: false
    }
  };
}

export default {
  presets: [createPreset({ grid: 'tailwind' })],
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'auth-bg': "url('https://picsum.photos/1080/720')"
      }
    }
  }
} satisfies Config;
