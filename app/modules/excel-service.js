const exceljs = require('exceljs');
const winston = require('./logger');

function readXLSX(filename){

    var workbook = new exceljs.Workbook();
    return workbook.xlsx.readFile(filename)
        .then(function(workbook){
            winston.logger.log('info',`DONE Reading: ${filename}`);
            return workbook;
        });

}

function getWorksheet(sheetName){
    return function(workbook){
        winston.logger.log('info',`Retrieving worksheet: ${sheetName}`);
        return workbook.getWorksheet(sheetName);
    }
}

function saveToExcel(filename, reportContents){

    winston.logger.log('info',`Generating Report: ${filename}`);
    var extension = /\.xlsx$/;

    if(!extension.test(filename)) filename = filename + ".xlsx"

    options = {
        filename: filename
    };

    workbook = new exceljs.stream.xlsx.WorkbookWriter(options);
    workbook.creator = "IOMS Tool";
    workbook.created = new Date();

    for(report of reportContents){
        
        sheet = workbook.addWorksheet(report.name);
        excelHeaders = [];

        if(report.headers){
            for(header of report.headers){
                excelHeaders.push({
                    header: header,
                    key: header,
                    width: 20,
                })
            }
        }else{
            for(header in report.contents[0]){
                excelHeaders.push({
                    header: header,
                    key: header,
                    width: 20,
                })
            }
        }

        sheet.columns = excelHeaders;
        for(content of report.contents){
            sheet.addRow(content);
        }
    }
    return workbook.commit();
}

module.exports = {
    readXLSX: readXLSX,
    getWorksheet: getWorksheet,
    saveToExcel:saveToExcel
}