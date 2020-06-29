import express from 'express'
import morgan from 'morgan'
import { initDB } from './database/database'
import user from './routes/users'
import cors from 'cors'

const app = express()
initDB()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/users', user)

app.get('/', (req, res) => res.send("Hello, World!"))

app.listen(8000, () => console.log("listening on 8000"))