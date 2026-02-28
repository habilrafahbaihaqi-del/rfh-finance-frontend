import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 1. Tambahin import ini

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Masukin ke dalam array plugins
  ],
});
