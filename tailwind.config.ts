import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // This single line ensures it scans EVERYTHING inside your src folder
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#010101",
          cyan: "#00B8D9",
          lime: "#A1C900",
          white: "#FFFFFF",
          slate: "#111111",
        },
      },
    },
  },
  plugins: [],
};
export default config;