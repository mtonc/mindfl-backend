import express from 'express'
import morgan from 'morgan'
import user from './routes/users'
import moods from './routes/moods'
import cors from 'cors'
import {initDB} from './database/database'

const app = express()
initDB();

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/users', user)
app.use('/moods', moods)

app.get('/', (req, res) => res.send("Hello, World!"))

app.listen(8000, () => console.log("listening on 8000"))