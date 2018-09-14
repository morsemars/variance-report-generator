const sqliteDB = require('./app/models/sqlite');

var db = sqliteDB.createDB(`master-files`);
sqliteDB.createTables(); 

const excelService = require('./app/modules/excel-service');
const salesReportService = require('./app/modules/sales-report-service.js');

/*    excelService.readXLSX(`IAM - Pack Code and Pack April 2018.xlsx`)
    .then(excelService.getWorksheet('IAM'))
    .then(sqliteDB.iamModel.insertWorksheet);    

    excelService.readXLSX(`SA - Pack Code and Pack April 2018.xlsx`)
    .then(excelService.getWorksheet('SA'))
    .then(sqliteDB.saModel.insertWorksheet);     

    var filename = `April 2018 - Active Clients April 2018.xlsx`;
var reportMonth = filename.split(" ")[0];
excelService.readXLSX(filename)
    .then(salesReportService.getReportDetails(reportMonth))
    .then(sqliteDB.activeClientsModel.insertWorksheets);     */

/*    sqliteDB.activeClientsModel.getClientList('April')
    .then(function(clients){
        var varianceReport = [];
        for(client of clients){
            varianceReport.push(sqliteDB.activeClientsModel.getVariance(client.client_id, client.category,'April'));
        }
        salesReportService.setClients(clients);
        return Promise.all(varianceReport);
    })
    .then(salesReportService.prepareReports)
    .then(function(reports){
        excelService.saveToExcel("Summary Report", reports.summaryReport);
        excelService.saveToExcel("Details Report", reports.detailsReport);
    }); */


/**
 * function(workbook){
        workbook.eachSheet(function(worksheet, sheetId){
            //console.log(worksheet.name);
            var type;
            var clientID;

            if(/^IAM/.test(worksheet.name)) type = 'IAM';
            else if(/^SA/.test(worksheet.name)) type = 'SA';

            clientID = /\d+/.exec(worksheet.name)[0];

            if(type && clientID) sqliteDB.activeClientsModel.insertWorksheet(worksheet, clientID, type, reportMonth)



        });
            console.timeEnd("XLSX-SQLITE");
    }
 * 
 */


/**
 * 1. read -> save to sqlite
 * 2. read -> promise.all -> compare contents
 * 
 */