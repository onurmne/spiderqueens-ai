import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // API endpoints
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "SpiderQueens",
      version: "1.0.0",
      time: new Date().toISOString(),
    });
  });

  // n8n Webhook simulation / proxy endpoint
  // When a contestant uploads a photo, frontend or trigger posts to /api/n8n/webhook
  app.post("/api/n8n/webhook", (req, res) => {
    const payload = req.body;
    console.log("⚡ [n8n Webhook Triggered]: Received payload:", payload);

    // Simulated response that n8n automation would return
    res.status(200).json({
      success: true,
      message: "n8n Webhook received contestant payload successfully!",
      event: "CONTESTANT_UPLOAD_CREATED",
      webhook_timestamp: new Date().toISOString(),
      telegram_notification_queued: true,
      data: payload,
    });
  });

  // Admin approval webhook trigger test endpoint
  app.post("/api/n8n/test-trigger", (req, res) => {
    const { webhookUrl, testPayload } = req.body;

    res.status(200).json({
      success: true,
      sentToUrl: webhookUrl || "https://n8n.example.com/webhook/spiderqueens-upload",
      responseCode: 200,
      timestamp: new Date().toISOString(),
      message: "Simulated n8n test dispatch succeeded. Telegram bot payload formatted.",
      previewPayload: testPayload || {
        event: "COSPLAY_SUBMITTED",
        contestant_name: "Gwen Stacy",
        country: "USA",
        instagram: "@gwenom_official",
        status: "pending",
      },
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🕷️ SpiderQueens Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
