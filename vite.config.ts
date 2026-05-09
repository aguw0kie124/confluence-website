import { nitro } from "nitro/vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  cloudflare: false,
  plugins: [nitro()],
});
