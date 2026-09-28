const express = require("express");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "CHANGE_ME";
const DATA_FILE = path.join(__dirname, "data", "messages.json");

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

const messageLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
});

function readMessages() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeMessages(messages) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), "utf8");
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

const sessions = new Map();

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function auth(req, res, next) {
  const token = req.get("x-admin-token");
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/config", (_req, res) => {
  res.json({ siteName: "October — 31 Days of You", recipient: "Nitin" });
});

app.get("/api/lyrics", (_req, res) => {
  const file = path.join(__dirname, "lyrics.txt");
  res.type("text/plain").send(fs.readFileSync(file, "utf8"));
});

app.post("/api/messages", messageLimiter, (req, res) => {
  const { name, day, message, mood } = req.body || {};
  if (!name || !message || String(message).trim().length < 1) {
    return res.status(400).json({ error: "Name and message are required." });
  }
  if (String(name).length > 60 || String(message).length > 3000) {
    return res.status(400).json({ error: "Message is too long." });
  }

  const messages = readMessages();
  messages.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(name).trim(),
    day: Number(day) || 0,
    mood: mood ? String(mood).slice(0, 40) : "",
    message: String(message).trim(),
    read: false
  });
  writeMessages(messages);
  res.json({ ok: true });
});

app.post("/api/admin/login", loginLimiter, (req, res) => {
  const { password } = req.body || {};
  if (!safeEqual(password || "", ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Wrong password." });
  }
  const token = createToken();
  sessions.set(token, { createdAt: Date.now() });
  setTimeout(() => sessions.delete(token), 8 * 60 * 60 * 1000);
  res.json({ ok: true, token });
});

app.post("/api/admin/logout", auth, (req, res) => {
  sessions.delete(req.get("x-admin-token"));
  res.json({ ok: true });
});

app.get("/api/admin/messages", auth, (_req, res) => {
  res.json(readMessages());
});

app.post("/api/admin/messages/:id/read", auth, (req, res) => {
  const messages = readMessages();
  const item = messages.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  item.read = true;
  writeMessages(messages);
  res.json({ ok: true });
});

app.delete("/api/admin/messages/:id", auth, (req, res) => {
  const messages = readMessages().filter(m => m.id !== req.params.id);
  writeMessages(messages);
  res.json({ ok: true });
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.listen(PORT, () => {
  console.log(`October website running on http://localhost:${PORT}`);
});
