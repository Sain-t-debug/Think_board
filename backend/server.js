import express from 'express'
import noteRoutes from './src/routes/noteRoutes.js'
import { connectDB } from './src/config/db.js'
import {rateLimiter} from './src/middleware/rateLimiter.js'
import dotenv from 'dotenv' // Fixed: removed the curly braces {}
import cors from 'cors'

const app = express()

const PORT = process.env.PORT || 8080;

dotenv.config()

app.use(cors({
  origin:"http://localhost:5173"
}))
app.use(express.json())
app.use(rateLimiter)


app.use('/api/notes', noteRoutes)

connectDB().then(() =>{
   app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on port ${PORT}`);
});
})



