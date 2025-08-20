module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        accent: "#22d3ee",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#2563eb",
          secondary: "#64748b",
          accent: "#22d3ee",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};
