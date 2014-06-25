/*Initialise sql connection*/
var sql = require('mssql');
var config = require('./config_dev.json').mssql;
var connection = new sql.Connection(config, function(err){
	if(err){
		console.log('Database connection error: ', err);
	}else{
		console.log('Database connection established.');
		//execute test functions during development here:

		//^^^
	}
});

var testQ = {
	currency: 'bi',
	start: '2014-06-25T20:11:08.246Z',
	end: '2014-06-25T20:16:39.868Z'
};

var queryConstructor = function(queryObj){
	var qString = {};
	qString.prefix = 'SELECT * FROM transactions';

	//parse date
	if(queryObj.hasOwnProperty('start') && queryObj.hasOwnProperty('end')){
		var start = new Date(queryObj.start).toISOString();
		var end = new Date(queryObj.end).toISOString();
		qString.date = ' WHERE updated BETWEEN ' + start + ' and ' + end;
	}

	//parse currency
	if(queryObj.currency === 'bi' || queryObj.currency === 'do' || queryObj.currency === 'li'){
		qString.currency = queryObj.currency;
	}

	return qString.prefix + qString.date + qString.currency;;
}

/*standard query to return all results*/
var query = function(queryObj){
	console.log(queryConstructor(testQ));

	// request.query('select * from transactions', function(err, recordset) {
	// 	if(err){
	// 		console.log(err);
	// 	}
	// 	cb(recordset);
	// });
};

query();

/*return minutely average in date range*/

/*return hourly average in date range*/

/*return daily average in date range*/


/*declare exports*/
module.exports.query = query;
