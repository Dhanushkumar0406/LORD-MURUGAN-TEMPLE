import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:5001",
      "/login": "http://127.0.0.1:5001",
      "/signup": "http://127.0.0.1:5001",
      "/logout": "http://127.0.0.1:5001",
      "/register": "http://127.0.0.1:5001",
      "/registration": "http://127.0.0.1:5001",
      "/registrations": "http://127.0.0.1:5001",
      "/my-registrations": "http://127.0.0.1:5001",
      "/approve": "http://127.0.0.1:5001",
      "/reject": "http://127.0.0.1:5001",
      "/citizen": "http://127.0.0.1:5001",
      "/stats": "http://127.0.0.1:5001",
      "/audit-logs": "http://127.0.0.1:5001"
    }
  },
  build: {
    sourcemap: true
  },
  logLevel: "info"
});
