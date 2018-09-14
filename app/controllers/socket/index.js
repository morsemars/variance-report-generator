const socketIO = require('../../modules/socket-io');
const excelToDBSocket = require('./excel-to-db-socket'); 
const salesReportSocket = require('./sales-report-socket'); 

module.exports = {
    excelToDBSocket: excelToDBSocket,
    salesReportSocket: salesReportSocket
}