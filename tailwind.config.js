import plugin from 'tailwindcss/plugin';
import {
  surfaces,
  borders,
  text,
  authority,
  consequence,
  gray,
  cssVariables,
} from './src/lawrence/palette.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',

        // LAWRENCE surface hierarchy (tier 0 → tier 4)
        env: surfaces.env,
        workspace: surfaces.workspace,
        surface: surfaces.surface,
        raised: surfaces.raised,
        interactive: surfaces.interactive,
        selected: surfaces.selected,

        edge: borders,
        ink: text,
        authority,
        consequence,

        // Re-tuned neutral ramp shared with the existing modules.
        gray,
      },
      maxWidth: {
        // Context chips are bounded, never elastic.
        chip: '220px',
        'chip-compact': '160px',
      },
      minHeight: {
        control: '32px',
      },
      boxShadow: {
        raised: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)',
        dock: '0 -1px 0 rgba(255,255,255,0.04), 0 -16px 40px -24px rgba(0,0,0,0.9)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({ ':root': cssVariables });
    }),
  ],
}
