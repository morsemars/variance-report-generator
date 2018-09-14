const winston = require('../../modules/logger');

var db;

function setDB(newDB){
    module.exports.db = db = newDB;
}

function createTable(){
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS clients (pack TEXT, units INTEGER, value INTEGER, type TEXT, month TEXT, client_id INTEGER, category TEXT)");
    });
}

function insert(newActiveClient){
    var stmt = db.prepare("INSERT INTO clients VALUES (?,?,?,?,?,?,?)");
    stmt.run(newActiveClient.pack, newActiveClient.units, newActiveClient.value, newActiveClient.type, newActiveClient.month, newActiveClient.client_id, newActiveClient.category);
    stmt.finalize();
}

function insertWorksheet(worksheet, clientID, type, month, category){
    db.serialize(function() {
        winston.logger.log('info',`Saving ${month} client: ${type}_${clientID}_${category}_M to SQLITE`);
        db.exec("BEGIN");
            var toBeInserted = false;
            worksheet.eachRow(function(row, rowNumber) {
                if(toBeInserted){
                    insert({
                        pack: row.values[1].replace(/\s+/g," ").trim(), 
                        units: row.values[2], 
                        value: row.values[3], 
                        type: type, 
                        month: month,
                        client_id: clientID,
                        category: category
                    })
                }
                if( !toBeInserted && (/pack/i.test(row.values[1]) || /units/i.test(row.values[2]) || /values/i.test(row.values[3])) ) toBeInserted = true;
            })
        db.exec("COMMIT");
    });
}

function insertWorksheets(worksheets){
    for(worksheet of worksheets) insertWorksheet(worksheet.worksheet, worksheet.clientID, worksheet.type, worksheet.month, worksheet.category)
}

function getClientList(month){
    var query = `SELECT DISTINCT client_id, category FROM clients WHERE month = '${month}'`;
    return db.allAsync(query);
}

function getVariance(clientID, category,month){
    var query = `SELECT 
            iamB.pack_code as 'iam_pack_code', 
            iamB.pack AS 'iam_pack', 
            iamB.units AS 'iam_units', 
            iamB.value AS 'iam_value',
            saB.ndf_code as 'sa_pack_code', 
            saB.pack AS 'sa_pack', 
            saB.units AS 'sa_units', 
            saB.value AS 'sa_value',
            (iamB.units - saB.units) AS 'unit_variance',
            (round(iamB.value) - saB.value) AS 'value_variance'
        FROM (
            SELECT DISTINCT iam.pack_code, c.pack, units, value
            FROM clients c
            LEFT JOIN iam
            ON c.pack = iam.pack
            WHERE client_id = ${clientID} 
            AND month = '${month}'
            AND category = '${category}'
            AND type = "IAM" 
            AND NOT ((units = 0 OR units = '-') AND (value = 0 OR value = '-'))
            ORDER BY units DESC
        ) iamB
        INNER JOIN (
            SELECT DISTINCT sa.ndf_code, c.pack, units, value
            FROM clients c
            LEFT JOIN sa
            ON c.pack = sa.pack
            WHERE client_id = ${clientID}
            AND month = '${month}'
            AND category = '${category}'
            AND type = "SA" 
            AND NOT ((units = 0 OR units = '-') AND (value = 0 OR value = '-'))
            ORDER BY units DESC
        )saB
        ON iamB.pack_code = saB.ndf_code
        ORDER BY unit_variance DESC`
    return db.allAsync(query);
}
  
module.exports = {
    createTable: createTable,
    insert: insert,
    setDB: setDB,
    insertWorksheet: insertWorksheet,
    insertWorksheets: insertWorksheets,
    getClientList:getClientList,
    getVariance: getVariance
}