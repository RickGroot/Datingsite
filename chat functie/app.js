const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.get('/', function(req, res) {
    res.render('index.ejs');
});
//basis express


app.use(express.static('./static'));
//css en js meegeven


io.on("connection", function(socket){
    console.log('made socket connection', socket.id);

    socket.on("chat", function(data){
        
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data)
    });
});
//socket code voor de backend

const server = http.listen(8080, function() {
    console.log('Server gestart op poort: 8080');
});
//checken of de server werkt


//bron : https://www.youtube.com/watch?v=vQjiN8Qgs3c&list=PL4cUxeGkcC9i4V-_ZVwLmOusj8YAUhj_9