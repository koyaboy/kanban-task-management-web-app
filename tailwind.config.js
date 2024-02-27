/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontSize: {
      'heading-XL': ['1.5rem', {
        lineHeight: '1.875rem',
        fontWeight: '700',
      }],
      'heading-L': ['1.125rem', {
        lineHeight: '1.438rem',
        fontWeight: '700',
      }],
      'heading-M': ['0.938rem', {
        lineHeight: '1.188rem',
        fontWeight: '700',
      }],
      'heading-S': ['0.75rem', {
        lineHeight: '0.938rem',
        fontWeight: '700',
      }],
      'body-L': ['0.813rem', {
        lineHeight: '1.438rem',
        fontWeight: '500',
      }],
      'body-M': ['0.75rem', {
        lineHeight: '0.938rem',
        fontWeight: '700',
      }],
    },

    extend: {
      colors: {
        "purple": "#635FC7",
        "purple-hover": "#A8A4FF",
        "black": "#000112",
        "very-dark-grey": "#20212C",
        "dark-grey-one": "#2B2C37",
        "dark-grey-two": "#3E3F4E",
        "medium-grey": "#828FA3",
        "light-grey": "#E4EBFA",
        "very-light-grey": "#F4F7FD",
        "white": "#FFFFFF",
        "red": "#EA5555",
        "red-hover": "#FF9898"
      },
    }
  },
  plugins: [],
}