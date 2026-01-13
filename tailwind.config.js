/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        "editorial-navy": "#1a2b49",
        "editorial-canvas": "#f8f9fb",
        "editorial-accent": "#e65c00",
        "editorial-slate": "#64748b",
      },
    },
  },
};
