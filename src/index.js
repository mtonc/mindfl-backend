import express from 'express'
import http from 'http'
import https from 'https'
import morgan from 'morgan'

const app = express()

app.use(morgan('dev'))

app.get('/', (req, res) => res.send("Hello, World!"))

app.listen(8000, () => console.log("Listening on port 8000"))

