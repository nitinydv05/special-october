import express from "express";
import serverless from "serverless-http";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getStore } from "@netlify/blobs";

const app = express();
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false }));

const __filename = "";
const __dirname = process.cwd();
const ROOT = path.resolve(__dirname, "../..");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const STORE = "october-khushi-messages";

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function sign(value) {
  return crypto.createHmac("sha256", ADMIN_PASSWORD).update(value).digest("base64url");
}

function createToken() {
  const payload = JSON.stringify({ sub: "nitin", exp: Date.now() + 8 * 60 * 60 * 1000 });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function validToken(token) {
  try {
    const [encoded, signature] = String(token || "").split(".");
    if (!encoded || !signature || !ADMIN_PASSWORD) return false;
    if (!safeEqual(signature, sign(encoded))) return false;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    return payload.sub === "nitin" && Number(payload.exp) > Date.now();
  } catch {
    return false;
  }
}

function auth(req, res, next) {
  const token = req.get("x-admin-token") || req.cookies?.nitinAdminToken;
  if (!validToken(token)) return res.status(401).json({ error: "Unauthorized" });
  next();
}

function store() {
  return getStore(STORE);
}

const router = express.Router();

router.get("/config", (_req, res) => {
  res.json({ siteName: "October — 31 Days of You", recipient: "Nitin" });
});

router.get("/lyrics", async (_req, res) => {
  try {
    const file = await fs.readFile(path.join(ROOT, "lyrics.txt"), "utf8");
    res.type("text/plain").send(file);
  } catch {
    res.type("text/plain").send("");
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { name, day, message, mood } = req.body || {};
    if (!name || !message || String(message).trim().length < 1) {
      return res.status(400).json({ error: "Name and message are required." });
    }
    if (String(name).length > 60 || String(message).length > 3000) {
      return res.status(400).json({ error: "Message is too long." });
    }
    const id = crypto.randomUUID();
    const item = {
      id,
      createdAt: new Date().toISOString(),
      name: String(name).trim(),
      day: Number(day) || 0,
      mood: mood ? String(mood).slice(0, 40) : "",
      message: String(message).trim(),
      read: false
    };
    await store().setJSON(`message/${id}`, item);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not save message." });
  }
});

router.post("/admin/login", async (req, res) => {
  const { password } = req.body || {};
  if (!ADMIN_PASSWORD || !safeEqual(password || "", ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Wrong password." });
  }
  res.json({ ok: true, token: createToken() });
});

router.post("/admin/logout", auth, (_req, res) => {
  res.json({ ok: true });
});

router.get("/admin/messages", auth, async (_req, res) => {
  try {
    const result = [];
    const { blobs } = await store().list({ prefix: "message/" });
    for (const blob of blobs) {
      const item = await store().get(blob.key, { type: "json" });
      if (item) result.push(item);
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not load inbox." });
  }
});

router.post("/admin/messages/:id/read", auth, async (req, res) => {
  try {
    const key = `message/${req.params.id}`;
    const item = await store().get(key, { type: "json" });
    if (!item) return res.status(404).json({ error: "Not found" });
    item.read = true;
    await store().setJSON(key, item);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not update message." });
  }
});

router.delete("/admin/messages/:id", auth, async (req, res) => {
  try {
    await store().delete(`message/${req.params.id}`);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not delete message." });
  }
});

app.use("/", router);
app.use("/api", router);
app.use("/.netlify/functions/api", router);

export const handler = serverless(app);
