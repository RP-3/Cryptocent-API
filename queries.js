/*Initialise sql connection*/
var sql = require('mssql');
var config = require('./config_dev.json').mssql;
var connection = new sql.Connection(config, function(err){
	if(err){
		console.log('Database connection error: ', err);
	}else{
		console.log('Database connection established.');
		//execute test functions during development here:
		minly(testQ, console.log);
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
var minly = function(queryObj, cb){
	var q = queryConstructor(queryObj);
	var request = connection.request();

	request.query(q, function(err, recordset) {
		if(err){
			console.log(err);
		}
		cb(recordset);
	});
};

/*return hourly average in date range*/
var hourly = function(queryObj, cb){
	var q = "select CAST(FLOOR(CAST(updated as float)) as datetime) as day, datepart(hh, updated) as hour, avg(ask) as ask, avg(bid) as bid, avg(last) as last from transactions where currency = '"+ queryObj.currency +"' and updated between '"+ new Date(queryObj.start).toISOString() +"' and '"+ new Date(queryObj.end).toISOString() +"' group by cast(FLOOR(CAST(updated as float)) as datetime), datepart(hh, updated) order by cast(FLOOR(CAST(updated as float)) as datetime) asc, datepart(hh, updated) asc";
	
	var request = connection.request();
	
	request.query(q, function(err, recordset){
		if(err){
			console.log(err);
		}
		cb(recordset);
	});
};


/*return daily average in date range*/
var daily = function(queryObj, cb){

	var parseSqlDate = function(dateString){
		var d = new Date(dateString);
		return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	};

	var q = "SELECT CAST(updated as date) as day, AVG(ask) as ask, AVG(bid) as bid, AVG(last) as last from transactions where currency = '"+ queryObj.currency +"' and updated between '"+ parseSqlDate(queryObj.start) +"' and '"+ parseSqlDate(queryObj.end) +"' group by cast(updated as date), datepart(mm, updated) order by cast(updated as date) asc";
	
	var request = connection.request();
	request.query(q, function(err, recordset){
		if(err){
			console.log(err);
		}
		cb(recordset);
	});
};


/*declare exports*/
module.exports.minly = minly;
