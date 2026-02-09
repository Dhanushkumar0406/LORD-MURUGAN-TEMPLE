import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:5000",
      "/login": "http://127.0.0.1:5000",
      "/signup": "http://127.0.0.1:5000",
      "/logout": "http://127.0.0.1:5000",
      "/register": "http://127.0.0.1:5000",
      "/registration": "http://127.0.0.1:5000",
      "/registrations": "http://127.0.0.1:5000",
      "/my-registrations": "http://127.0.0.1:5000",
      "/approve": "http://127.0.0.1:5000",
      "/reject": "http://127.0.0.1:5000",
      "/citizen": "http://127.0.0.1:5000",
      "/stats": "http://127.0.0.1:5000",
      "/audit-logs": "http://127.0.0.1:5000"
    }
  },
  build: {
    sourcemap: true
  },
  logLevel: "info"
});
