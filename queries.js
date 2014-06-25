/*Initialise sql connection*/
var sql = require('mssql');
var config = require('./config_dev.json').mssql;
var connection = new sql.Connection(config, function(err){
	if(err){
		console.log('Database connection error: ', err);
	}else{
		console.log('Database connection established.');
		//execute test functions during development here:
		query(testQ, console.log);
		//^^^
	}
});

var testQ = {
	currency: 'bi',
	start: '2014-06-25T20:11:08.246Z',
	end: '2014-06-25T20:16:39.868Z'
};

//expects an object in the form of testQ
var queryConstructor = function(queryObj){
	var qString = {};
	qString.prefix = "SELECT * FROM transactions WHERE ";

	//parse currency
	if(queryObj.currency === "bi" || queryObj.currency === "do" || queryObj.currency === "li"){
		qString.currency =  "currency = '" + queryObj.currency + "'";
	}

	//parse date
	if(queryObj.hasOwnProperty('start') && queryObj.hasOwnProperty('end')){
		var start = new Date(queryObj.start).toISOString();
		var end = new Date(queryObj.end).toISOString();
		qString.date = " AND updated BETWEEN '" + start + "' and '" + end +"'";
	}

	return qString.prefix + qString.currency + qString.date;
};

/*standard query to return all results*/
var query = function(queryObj, cb){
	var q = queryConstructor(queryObj);
	console.log(q);
	var request = connection.request();

	request.query(q, function(err, recordset) {
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
