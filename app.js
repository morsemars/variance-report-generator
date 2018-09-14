const 
    express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    api = require('./app/controllers/express'),
    sockets = require('./app/controllers/socket'),
    socketIO = require('./app/modules/socket-io');

const winston = require('./app/modules/logger');
const sqliteDB = require('./app/models/sqlite');

var 
    port = 3001,
    app = express(),
    server;

winston.init('logs/ioms.log')
winston.logger.log('info', `Starting IOMS Tool`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

api(app);

var db = sqliteDB.createDB(`master-files`);
winston.logger.log('info', `Initialized database...`);
sqliteDB.createTables(); 

app.use('/', express.static(__dirname + '/public'));

server = http.createServer(app);
server.listen(port);
winston.logger.log('info', `Started Server on ${port}`);

socketIO.init(server);
winston.logger.log('info', `Initialized Socket.IO`);

sockets.excelToDBSocket.create(socketIO.io);
sockets.salesReportSocket.create(socketIO.io);