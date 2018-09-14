const winston = require('./logger');

var clients;

function setClients(newClients){
    clients = module.exports.clients = newClients;
}

function getReportDetails(month){
    return function(workbook){
        var IAM_SA_REPORTS = [];

        workbook.eachSheet(function(worksheet, sheetId){

            var type;
            var category;
            var clientID;
            var categoryMatch;

            if(/^IAM/.test(worksheet.name)) type = 'IAM';
            else if(/^SA/.test(worksheet.name)) type = 'SA';

            categoryMatch = /_\w_/.exec(worksheet.name);
            if(categoryMatch) category = categoryMatch[0].replace(/_/g,"");

            clientID = /\d+/.exec(worksheet.name)[0];

            if(type && clientID && category) IAM_SA_REPORTS.push({
                worksheet: worksheet, 
                clientID: clientID, 
                type:type, 
                month: month,
                category: category
            })

        });

        return IAM_SA_REPORTS;
    }
}

function prepareReports(varianceReports){
    return {
        summaryReport: createSummaryReport(varianceReports),
        detailsReport: createDetailsReport(varianceReports)
    }
}

function createSummaryReport(varianceReports){
    winston.logger.log('info',`Preparing Report: Summary Report`);
    var summaryReportContents = varianceReports.map(function(varianceReport, i) {
        varianceReport[0].client_id = `COMP_${clients[i].client_id}_${clients[i].category}_M`
        return varianceReport[0];
    });

    return [{
        name: `Sales Report Variance Summary`,
        contents: summaryReportContents,
        headers: ["client_id","iam_pack_code", "iam_units", "iam_value", "sa_pack_code", "sa_units", "sa_value", "unit_variance", "value_variance"]
    }];
}

function createDetailsReport(varianceReports){
    winston.logger.log('info',`Preparing Report: Details Report`);
    var detailsReport = varianceReports.map(function(varianceReport, i) {

        return {
            name: `COMP_${clients[i].client_id}_${clients[i].category}_M`,
            contents: varianceReport,
            headers: ["iam_pack_code", "iam_units", "iam_value", "sa_pack_code", "sa_units", "sa_value", "unit_variance", "value_variance"]
        }

    });

    return detailsReport;
}


module.exports = {
    getReportDetails: getReportDetails,
    prepareReports: prepareReports,
    setClients: setClients
}