import express from 'express'
import noteRoutes from './src/routes/noteRoutes.js'
import { connectDB } from './src/config/db.js'
import { rateLimiter } from './src/middleware/rateLimiter.js'
import dotenv from 'dotenv'
import cors from 'cors'
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080;

// Resolve paths from this file (not process.cwd()) so it works no matter
// which directory the host starts the server from.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, "..", "frontend", "dist")

// Required so req.ip reflects the real client (Render/Heroku/etc. sit behind a proxy),
// otherwise every visitor shares the proxy IP and gets rate limited as one user.
app.set("trust proxy", 1)

if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: "http://localhost:5173"
  }))
}

app.use(express.json())

// Rate limit the API only. Static assets must not consume the quota.
app.use('/api', rateLimiter)

// API Routes
app.use('/api/notes', noteRoutes)

// Frontend Routing: serve the built SPA whenever it exists, so the app works
// even if NODE_ENV isn't set to "production" on the host.
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))

  app.get("*any", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"))
  })
} else {
  app.get('/', (req, res) => {
    res.json({
      status: "success",
      message: "Backend is running! Access your notes API at /api/notes"
    });
  })
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running smoothly on port ${PORT}`);
  });
})
