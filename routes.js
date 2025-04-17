import express from 'express'
import authRoutes from './routes/authroutes.js'

const router = express.Router()
router.use(authRoutes)

export default router