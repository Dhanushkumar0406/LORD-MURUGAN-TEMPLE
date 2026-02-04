import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/register": "http://127.0.0.1:5000",
      "/status": "http://127.0.0.1:5000",
      "/admin": "http://127.0.0.1:5000",
      "/tour": "http://127.0.0.1:5000",
      "/places": "http://127.0.0.1:5000"
    }
  }
});
