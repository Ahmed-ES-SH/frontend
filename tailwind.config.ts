import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main_blue: "var(--main_blue)",
        main_orange: "var(--main_orange)",
        main_red: "var(--main_red)",
        main_dash: "var(--main_dash)",
        secend_dash: "var(--secend_dash)",
        secend_text: "var(--secend_text)",
        main_text: "var(--main_text)",
      },
    },
  },
  plugins: [],
};
export default config;
