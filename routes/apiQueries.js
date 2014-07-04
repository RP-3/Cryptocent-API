/*Initialise sql connection*/
var sql = require('mssql');
var config = require('../config_dev.json').mssql_api;
var connection = new sql.Connection(config, function(err){
	if(err){
		console.log('API database connection error:');
		console.log(err);
		process.exit();
	}else{
		console.log('API database connection established.');
	}
});

//only for development
var testQ = {
	currency: 'bi',
	start: '2014-06-25T20:11:08.246Z',
	end: '2014-06-25T20:16:39.868Z'
};

/*standard query to return all results*/
var minly = function(queryObj, cb){
	var q = "SELECT * FROM transactions WHERE currency = '"+ queryObj.currency +"' AND updated BETWEEN '"+ new Date(queryObj.start).toISOString() +"' and '" + new Date(queryObj.end).toISOString() + "' order by updated asc";
	var request = connection.request();

	request.query(q, cb); //passes (error, data) to callback
};

/*return hourly average in date range*/
var hourly = function(queryObj, cb){
	var q = "select CAST(FLOOR(CAST(updated as float)) as datetime) as day, datepart(hh, updated) as hour, avg(ask) as ask, avg(bid) as bid, avg(last) as last from transactions where currency = '"+ queryObj.currency +"' and updated between '"+ new Date(queryObj.start).toISOString() +"' and '"+ new Date(queryObj.end).toISOString() +"' group by cast(FLOOR(CAST(updated as float)) as datetime), datepart(hh, updated) order by cast(FLOOR(CAST(updated as float)) as datetime) asc, datepart(hh, updated) asc";
	
	var request = connection.request();
	
	request.query(q, cb);
};

/*return daily average in date range*/
var daily = function(queryObj, cb){
	var parseSqlDate = function(dateString){
		var d = new Date(dateString);
		return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	};

	var q = "SELECT CAST(updated as date) as day, AVG(ask) as ask, AVG(bid) as bid, AVG(last) as last from transactions where currency = '"+ queryObj.currency +"' and updated between '"+ parseSqlDate(queryObj.start) +"' and '"+ parseSqlDate(queryObj.end) +"' group by cast(updated as date), datepart(mm, updated) order by cast(updated as date) asc";
	
	var request = connection.request();
	request.query(q, cb);
};

/*declare exports*/
module.exports.minly = minly;
module.exports.hourly = hourly;
module.exports.daily = daily;
