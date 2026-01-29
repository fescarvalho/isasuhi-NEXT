// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sushi: {
          red: '#d32f2f',       // Vermelho do aviso
          darkRed: '#3b0d0d',   // Títulos
          card: '#1e1e1e',      // Fundo dos cards (como no seu site)
          bg: '#ffffff',        // Fundo do site
        }
      },
    },
  },
  plugins: [],
};
export default config;