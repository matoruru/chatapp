"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const crypto_1 = __importDefault(require("crypto"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const port = 3000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const createToken = (id) => {
    console.log(`Token generated with id ${id}`);
    const str = `fjewoipafjapewh${id}`;
    return crypto_1.default.createHash("SHA1").update(str).digest('hex');
};
io.on('connection', (socket) => {
    console.log('a user connected');
    const token = createToken(socket.id);
    io.to(socket.id).emit("token", { token });
    socket.on('disconnect', function () {
        console.log('a user disconnected');
    });
    socket.on('sendMessage', (message) => {
        console.log(message);
        io.emit('receiveMessage', message);
    });
});
app.use('/', express_1.default.static(path_1.default.join(__dirname, '/frontend/build')));
server.listen(port, () => {
    console.log(`Chat app listening on port ${port}`);
});
