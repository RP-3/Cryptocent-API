/*Initialise sql connection*/
var sql = require('mssql');
var config = require('./config_dev.json').mssql;
var connection = new sql.Connection(config, function(err){
	if(err){
		console.log('Database connection error: ', err);
	}else{
		console.log('Database connection established.');
		//execute test functions during development here:
		hourly(testQ, console.log);
		//^^^
	}
});

var testQ = {
	currency: 'bi',
	start: '2014-06-24T20:11:08.246Z',
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


var daily = function(queryObj, cb){
	/* return daily average in date range
	SELECT 
	CAST (updated as date), 
	AVG(ask) as ask, AVG(bid) as bid, AVG(last) as last
	from transactions
	where currency = 'bi'
	and updated between '2014-06-24' and '2014-06-26'
	group by cast(updated as date)
	order by case (updated as date) asc
	*/
};


/*declare exports*/
module.exports.query = query;
