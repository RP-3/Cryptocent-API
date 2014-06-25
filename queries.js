/*Initialise sql connection*/
var sql = require('mssql');
var config = require('./config_dev.json').mssql;
var connection = new sql.Connection(config, function(err){
	if(err){
		console.log('Database connection error: ', err);
	}else{
		console.log('Database connection established.');
	}
});


/*standard query to return all results*/
var query = function(cb){
	request.query('select * from transactions', function(err, recordset) {
		if(err){
			console.log(err);
		}
		cb(recordset);
	});
};

/*return minutely average in date range*/

/*return hourly average in date range*/

/*return daily average in date range*/


/*declare exports*/
module.exports.query = query;