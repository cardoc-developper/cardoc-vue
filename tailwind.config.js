/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0B0A13',
        'dark-purple': '#2E021F',
        'dark-red': '#53000A',
        'deep-red': '#7A0507',
        'burnt-red': '#B1200C',
        'vibrant-red': '#D83210',
        'orange': '#E85C29',
        'light-orange': '#F17D34',
        'gold': '#F89B38',
        'yellow': '#FABC3C',
      },
    },
  },
  plugins: [],
};
