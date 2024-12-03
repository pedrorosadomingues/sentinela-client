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
        "smooth-return-end": "cubic-bezier(0, 0, 0.27, 1.55)",
      },
      animation: {
        "spin-bounce": "spinBounce 0.9s linear infinite",
      },
      keyframes: {
        spinBounce: {
          "0%": {
            transform: "rotateY(0deg) translateY(0%)",
          },
          "25%": {
            transform: "rotateY(90deg) translateY(-40%)",
          },
          "50%": {
            transform: "rotateY(180deg) translateY(-80%)",
          },
          "75%": {
            transform: "rotateY(270deg) translateY(-40%)",
          },
          "100%": {
            transform: "rotateY(360deg) translateY(0%)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
