const excelToDB = require('./excel-to-db');
const salesReport = require('./sales-report');

module.exports = function(app){
    app.use('/api',[excelToDB, salesReport]);
}