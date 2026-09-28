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
  return getStore({
    name: STORE,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_API_TOKEN
  });
}

const router = express.Router();
router.use((req, res, next) => {
  let b = req.body;
  if (Buffer.isBuffer(b)) b = b.toString('utf8');
  if (typeof b === 'string') {
    try { req.body = JSON.parse(b); } catch(e) {}
  } else if (!b || Object.keys(b).length === 0) {
    if (req.apiGateway && req.apiGateway.event && req.apiGateway.event.body) {
      try {
        let raw = req.apiGateway.event.body;
        if (req.apiGateway.event.isBase64Encoded) raw = Buffer.from(raw, 'base64').toString('utf8');
        req.body = JSON.parse(raw);
      } catch(e) {}
    }
  }
  next();
});


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
    let payload = req.body || {};
    // Fallback for Netlify serverless-http body parsing issues
    if ((!payload.name || !payload.message) && req.apiGateway && req.apiGateway.event && req.apiGateway.event.body) {
      try {
        let raw = req.apiGateway.event.body;
        if (req.apiGateway.event.isBase64Encoded) {
          raw = Buffer.from(raw, 'base64').toString('utf8');
        }
        payload = JSON.parse(raw);
      } catch(e) {}
    }
    // Final fallback if body is just a string (sometimes Express does this if content-type is missing)
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch(e) {}
    }

    const { name, day, message, mood } = payload;
    if (!name || !message || String(message).trim().length < 1) {
      return res.status(400).json({ error: `Name and message are required. Debug: body keys=${Object.keys(payload).join(',')}` });
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
    res.status(500).json({ error: `Backend Error: ${e.message || String(e)}` });
  }
});

router.post("/admin/login", async (req, res) => {
  const adminPass = process.env.ADMIN_PASSWORD || "";
  const { password } = req.body || {};
  if (!adminPass || !safeEqual(password || "", adminPass)) {
    return res.status(401).json({ error: `Wrong password. (Body keys: ${Object.keys(req.body || {}).join(',')}, Env length: ${adminPass.length})` });
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

router.get("/replies", async (_req, res) => {
  try {
    const result = [];
    const { blobs } = await store().list({ prefix: "message/" });
    for (const blob of blobs) {
      const item = await store().get(blob.key, { type: "json" });
      if (item && item.reply) result.push(item);
    }
    result.sort((a, b) => new Date(b.replyAt || b.createdAt) - new Date(a.replyAt || a.createdAt));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "Could not load replies." });
  }
});

router.post("/admin/messages/:id/reply", auth, async (req, res) => {
  try {
    const { replyText } = req.body || {};
    if (!replyText) return res.status(400).json({ error: "No text provided." });
    
    const key = `message/${req.params.id}`;
    const item = await store().get(key, { type: "json" });
    if (!item) return res.status(404).json({ error: "Not found" });
    item.reply = String(replyText).trim();
    item.replyAt = new Date().toISOString();
    await store().setJSON(key, item);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Could not reply." });
  }
});

app.use("/", router);
app.use("/api", router);
app.use("/.netlify/functions/api", router);

export const handler = serverless(app);
