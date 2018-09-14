const winston = require('../../modules/logger');

var db;

function setDB(newDB){
    module.exports.db = db = newDB;
}

function createTable(){
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS iam (pack_code TEXT, pack TEXT)");
    });
}

function insert(newIAM){
    var stmt = db.prepare("INSERT INTO iam VALUES (?,?)");
    stmt.run(newIAM.pack_code, newIAM.pack);
    stmt.finalize();
}

function deleteAll(){
    return db.serialize(function() {
        db.run("DELETE FROM iam");
    });
}

function insertWorksheet(worksheet){

    /**
     * Enclose SQLITE operations in transaction
     * for faster processing time. 
     * 
     * 39645 records inserted in 195ms
     */

    //deleteAll();
    
    return db.serialize(function() {
        winston.logger.log('info',`Saving worksheet rows to SQLITE`);
        db.exec("BEGIN");
            worksheet.eachRow(function(row, rowNumber) {
                if(rowNumber > 1){
                    insert({
                        pack_code: row.values[1],
                        pack: row.values[2]
                    })
                }
            })
        db.exec("COMMIT");
    });
}
  
module.exports = {
    createTable: createTable,
    insert: insert,
    setDB: setDB,
    insertWorksheet: insertWorksheet,
    deleteAll: deleteAll
}