import express from 'express'
import noteRoutes from './src/routes/noteRoutes.js'
import { connectDB } from './src/config/db.js'
import { rateLimiter } from './src/middleware/rateLimiter.js'
import dotenv from 'dotenv'
import cors from 'cors'
import path from "path" 

dotenv.config() 

const app = express()
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve() 

if (process.env.NODE_ENV !== "production") {
app.use(cors({
origin: "http://localhost:5173"
}))
} 

app.use(express.json())
app.use(rateLimiter) 

// API Routes
app.use('/api/notes', noteRoutes) 

// Frontend Routing
if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "frontend", "dist"))) 

app.get("*any", (req, res) => {
res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
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