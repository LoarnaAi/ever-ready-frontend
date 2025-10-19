/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/removal-page/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'everready': {
          primary: '#007BFF',  // Electric Blue
          secondary: '#007BFF', // Electric Blue
          dark: '#111111',   // Dark background
        },
        'yellow': {
          500: '#EAB308', // Yellow for the removal page
        }
      },
    },
  },
  plugins: [],
}
