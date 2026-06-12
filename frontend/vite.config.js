import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/auth": "https://interior-design-platform-production.up.railway.app",
      "/design-requests": "https://interior-design-platform-production.up.railway.app",
      "/designers": "https://interior-design-platform-production.up.railway.app",
      "/contractor-offers": "https://interior-design-platform-production.up.railway.app",
    },
  },
});
