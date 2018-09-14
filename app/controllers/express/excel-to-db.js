const expressRouter = require('express').Router;
const router = expressRouter();
const sqliteDB = require('../../models/sqlite');
const excelService = require('../../modules/excel-service');
const salesReportService = require('../../modules/sales-report-service.js');
const winston = require('../../modules/logger');
const socket = require('../socket');

router.post('/iam/excel/save', function(req, res){

    winston.logger.log('info',`${req.method} ${req.url}`);

    excelService.readXLSX(req.query.file)
        .then(excelService.getWorksheet('IAM'))
        //.then(sqliteDB.iamModel.deleteAll)
        .then(sqliteDB.iamModel.insertWorksheet)
        .then(function(db){
            winston.logger.log('info',`DONE saving worksheet rows to SQLITE`);
            winston.logger.log('info',`Emitting 'excel-saved'...`);
            socket.excelToDBSocket.socket.emit('excel-saved', {iamStatus:"Success"});
        })
        .catch(function(error){
            winston.logger.log('error',`Could not POST /iam/excel/save File:${req.query.file}`);
            winston.logger.log('error',`ERROR: ${error}`);
            socket.excelToDBSocket.socket.emit('excel-save-error', {iamStatus:error});
        });   

    res.json({iamStatus:"Reading"});
});

router.post('/sa/excel/save', function(req, res){

    winston.logger.log('info',`${req.method} ${req.url}`);

    excelService.readXLSX(req.query.file)
        .then(excelService.getWorksheet('SA'))
        .then(sqliteDB.saModel.insertWorksheet)
        .then(function(db){
            winston.logger.log('info',`DONE saving worksheet rows to SQLITE`);
            winston.logger.log('info',`Emitting 'excel-saved'...`);
            socket.excelToDBSocket.socket.emit('excel-saved', {saStatus:"Success"});
        })
        .catch(function(error){
            winston.logger.log('error',`Could not POST /sa/excel/save File:${req.query.file}`);
            winston.logger.log('error',`ERROR: ${error}`);
            socket.excelToDBSocket.socket.emit('excel-save-error', {saStatus:error});
        });   

    res.json({saStatus:"Reading"});
});

router.post('/sales-report/excel/save', function(req, res){

    winston.logger.log('info',`${req.method} ${req.url}`);

    excelService.readXLSX(req.query.file)
        .then(salesReportService.getReportDetails(req.query.month))
        .then(sqliteDB.activeClientsModel.insertWorksheets)
        .then(function(db){
            winston.logger.log('info',`DONE saving worksheets rows to SQLITE`);
            winston.logger.log('info',`Emitting 'excel-saved'...`);
            socket.excelToDBSocket.socket.emit('excel-saved', {salesReportStatus:"Success"});
        })
        .catch(function(error){
            winston.logger.log('error',`Could not POST /sales-report/excel/save File:${req.query.file}`);
            winston.logger.log('error',`ERROR: ${error}`);
            socket.excelToDBSocket.socket.emit('excel-save-error', {salesReportStatus:error});
        });

    res.json({salesReportStatus:"Reading"});
});

module.exports = router;