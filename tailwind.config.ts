import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        //lexend: ["var(--font-lexend)"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "primary-background": "linear-gradient(135deg, #F10641FF, #F83A14FF)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      transitionTimingFunction: {
        'smooth-return-end': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
    },
  },
  plugins: [],
};
export default config;
