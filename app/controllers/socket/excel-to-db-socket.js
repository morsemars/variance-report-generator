const winston = require('../../modules/logger');

var socket;

function create(io){
    socket = module.exports.socket = io
    .of('/excel-to-db')
    .on('connection', function (socket) {
        winston.logger.log('info',`Socket: ${socket.id} connected`);
    });
}

module.exports = {
    create: create
}