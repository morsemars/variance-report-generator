const io = require('socket.io');

function init(server){
    ioSocket = module.exports.io = io(server);
}

/* var chat = io.ioSocket
  .of('/chat')
  .on('connection', function (socket) {
    socket.on('hi!', function (from, msg) {
        console.log('I received a private message by ', from, ' saying ', msg);
    });
    socket.emit('a message', {that: 'only', '/chat': 'will get'});
    chat.emit('a message', {everyone: 'in', '/chat': 'will get'});
  }); */

module.exports = {
    init: init
}