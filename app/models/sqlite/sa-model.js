const winston = require('../../modules/logger');

var db;

function setDB(newDB){
    module.exports.db = db = newDB;
}

function createTable(){
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS sa (ndf_code TEXT, product_code TEXT, pack_code TEXT,product TEXT, pack TEXT)");
    });
}

function insert(newSA){
    var stmt = db.prepare("INSERT INTO sa VALUES (?,?,?,?,?)");
    stmt.run(newSA.ndf_code, newSA.product_code, newSA.pack_code,newSA.product, newSA.pack);
    stmt.finalize();
}

function insertWorksheet(worksheet){

    db.serialize(function() {
        winston.logger.log('info',`Saving worksheet rows to SQLITE`);
        db.exec("BEGIN");
            worksheet.eachRow(function(row, rowNumber) {

                if(rowNumber > 1){
                    insert({
                        ndf_code: row.values[1], 
                        product_code: row.values[2], 
                        pack_code: row.values[3],
                        product: row.values[4], 
                        pack: row.values[5]
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
    insertWorksheet: insertWorksheet
}