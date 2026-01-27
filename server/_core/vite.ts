import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

// For development mode only - dynamically import vite
async function getViteConfig() {
  const { default: viteConfig } = await import("../../vite.config");
  return viteConfig;
}

export async function setupVite(app: Express, server: Server) {
  const { createServer: createViteServer } = await import("vite");
  const viteConfig = await getViteConfig();
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Use process.cwd() which is reliable in all environments
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production on Railway, the built files are in dist/public
  // The dist/index.js runs from the /app directory, so dist/public is at /app/dist/public
  // We use process.cwd() which gives us /app on Railway
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  console.log(`[Static] Serving static files from: ${distPath}`);
  console.log(`[Static] Current working directory: ${process.cwd()}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(
      `[Static] ERROR: Could not find the build directory: ${distPath}`
    );
    console.error(`[Static] Directory contents of ${process.cwd()}:`);
    try {
      const contents = fs.readdirSync(process.cwd());
      console.error(`[Static] ${contents.join(", ")}`);
    } catch (e) {
      console.error(`[Static] Could not read directory`);
    }
  } else {
    console.log(`[Static] Build directory found successfully`);
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).send("index.html not found. Build may have failed.");
    }
  });
}
