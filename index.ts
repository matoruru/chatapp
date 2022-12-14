import express from 'express'
import path from 'path'
import http from 'http'
import crypto from 'crypto'
import { Server } from 'socket.io'
const app = express()
const port = 3000

const server = http.createServer(app)
const io = new Server(server)

const createToken = (id: string) => {
  const str = `fjewoipafjapewh${id}`
  return crypto.createHash("SHA1").update(str).digest('hex')
}

const appLog = (s: string) => {
  console.log(`[${new Date().toLocaleString('ja-JP')}] ${s}`)
}

io.on('connection', (socket) => {
  const token = createToken(socket.id)
  appLog(`A user "${token}" connected.`)
  io.to(socket.id).emit("token", { token })
  socket.on('disconnect', function () {
    appLog(`A user "${token}" disconnected.`)
  });
  socket.on('sendMessage', (message) => {
    appLog(message)
    io.emit('receiveMessage', message)
  })
})

app.use('/', express.static(path.join(__dirname, '/frontend/build')))

server.listen(port, () => {
  appLog(`Chat app listening on port ${port}`)
})