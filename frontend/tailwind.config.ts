import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F7FAF9",
        surface: "#FFFFFF",
        border: "#D9E2EC",
        primary: "#1F6F78",
        secondary: "#2FA39A",
        success: "#2E9E6F",
        warning: "#F4B740",
        destructive: "#D95D5D",
        info: "#5B8DEF",
        ink: {
          DEFAULT: "#1F2933",
          muted: "#52606D",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 41, 51, 0.06)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
