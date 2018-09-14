const 
    Promise = require('bluebird'),
    sqlite3 = Promise.promisifyAll(require('sqlite3'))
    TransactionDatabase = require("sqlite3-transactions").TransactionDatabase,
    activeClientsModel = require('./active-clients-model'),
    iamModel = require('./iam-model'),
    saModel = require('./sa-model');

var db;

function createDB(database){
    db = new sqlite3.Database(database);
    iamModel.setDB(db);
    saModel.setDB(db);
    activeClientsModel.setDB(db);
    return db;
} 

function createTables(){
    iamModel.createTable();
    saModel.createTable();
    activeClientsModel.createTable();
}

module.exports = {
    createDB: createDB,
    createTables: createTables,
    iamModel: iamModel,
    saModel: saModel,
    activeClientsModel: activeClientsModel
}