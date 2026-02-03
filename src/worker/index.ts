import { Hono } from "hono";

interface Env {
  DB: any;
  R2_BUCKET: any;
}

const app = new Hono<{ Bindings: Env }>();

export default app;
