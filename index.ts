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
  console.log(`Token generated with id ${id}`)
  const str = `fjewoipafjapewh${id}`
  return crypto.createHash("SHA1").update(str).digest('hex')
}

io.on('connection', (socket) => {
  console.log('a user connected')
  const token = createToken(socket.id)
  io.to(socket.id).emit("token", { token })

  socket.on('disconnect', function () {
    console.log('a user disconnected');
  });
  socket.on('sendMessage', (message) => {
    console.log(message)
    io.emit('receiveMessage', message)
  })
})

app.use('/', express.static(path.join(__dirname, '/frontend/build')))

server.listen(port, () => {
  console.log(`Chat app listening on port ${port}`)
})