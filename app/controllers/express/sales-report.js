const expressRouter = require('express').Router;
const router = expressRouter();
const sqliteDB = require('../../models/sqlite');
const excelService = require('../../modules/excel-service');
const salesReportService = require('../../modules/sales-report-service.js');
const winston = require('../../modules/logger');
const socket = require('../socket');

router.get('/sales-report/generate/all', function(req, res){

    winston.logger.log('info',`${req.method} ${req.url}`);

    sqliteDB.activeClientsModel.getClientList(req.query.month)
        .then(function(clients){
            var varianceReport = [];
            for(client of clients){
                varianceReport.push(sqliteDB.activeClientsModel.getVariance(client.client_id, client.category, req.query.month));
            }
            salesReportService.setClients(clients);
            return Promise.all(varianceReport);
        })
        .then(salesReportService.prepareReports)
        .then(function(reports){
            winston.logger.log('info',`Creating Excel Reports...`);
            return Promise.all([
                excelService.saveToExcel(`${req.query.month} Summary Report`, reports.summaryReport),
                excelService.saveToExcel(`${req.query.month} Details Report`, reports.detailsReport)
            ]);
        })
        .then(function(excelReports){
            winston.logger.log('info',`Successfully Generated Reports`);
            winston.logger.log('info',`Emitting 'sales-report-generated'...`);
            socket.salesReportSocket.socket.emit('sales-report-generated', {salesReportGenerationStatus:"Success"});
        })
        .catch(function(error){
            winston.logger.log('error',`Could not GET /sales-report/generate/all Month:${req.query.month}`);
            winston.logger.log('error',`ERROR: ${error}`);
            socket.salesReportSocket.socket.emit('sales-report-generate-error', {salesReportGenerationStatus:error});
        });
 
    res.json({salesReportGenerationStatus:"Generating"});
});

module.exports = router;