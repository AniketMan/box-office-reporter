import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { ActionsModule } from "./server/src/runtime";

const actionsSource = fileURLToPath(new URL("./server/src/actions.ts", import.meta.url));
const serverDist = fileURLToPath(new URL("./server/dist", import.meta.url));

// Serves POST /actions ({ action, args }) from server/src/actions.ts: through
// Vite's module loader in dev, from the built bundle under `vite preview`.
function actionsPlugin(): Plugin {
  const handle = (load: () => Promise<ActionsModule>) => async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.method !== "POST") return next();
    const { runAction } = await import("./server/src/http");
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const { status, body } = await runAction(await load(), Buffer.concat(chunks).toString("utf8"));
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  };
  return {
    name: "film-calculator-actions",
    configureServer(server) {
      server.middlewares.use("/actions", handle(async () => (await server.ssrLoadModule(actionsSource)).Actions));
    },
    configurePreviewServer(server) {
      server.middlewares.use("/actions", handle(async () => (await import(/* @vite-ignore */ `${serverDist}/actions.js`)).Actions));
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  root: "client",
  plugins: [react(), tailwindcss(), actionsPlugin()],
  build: isSsrBuild
    ? { outDir: serverDist, emptyOutDir: true, rollupOptions: { input: actionsSource } }
    : { outDir: "dist", emptyOutDir: true },
}));
