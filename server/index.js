const express = require('express');
const http = require('http');

const port = 8080;
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');

const io = socket(server);

app.get('/', (req, res) => {
  res.send({ code: '00', data: null });
});

io.on('connection', (socket) => {
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message });
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
