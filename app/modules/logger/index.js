const winston = require('winston');
const logRotate = require('winston-logrotate');

function init(logfile){

    var rotateTransport, logger;

    rotateTransport = new (winston.transports.Rotate)({
            file: logfile,
            colorize: false,
            timestamp: true,
            json: false,
            size: '10m',
            keep: 5,
            compress: false
    });

    logger = module.exports.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            rotateTransport
        ]
    });

    logger.level = 'debug';
}



module.exports = {
    init: init
};