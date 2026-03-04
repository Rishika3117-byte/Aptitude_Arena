import { Hono } from "hono";

interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

export default app;
