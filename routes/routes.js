var express = require('express');
var apiRouter = express.Router();
var analyticsRouter = express.Router();

/*validate currency param*/
apiRouter.param('currency', function(req, res, next, currency){
	req.query = req.query || {};
	if(!(currency === 'bi' || currency === 'li' || currency === 'do')){
		res.send(403.10, 'Invalid currency parameter. Use "bi", "li" or "do". ');
	}else{
		req.query.currency = currency;
		next();
	}
});

/*validate start param*/
apiRouter.param('start', function(req, res, next, start){
	req.query = req.query || {};
	var startdate = Date.parse(start);

	if(req.query.end){
		if(req.query.end < startdate){
			res.send(403.10, 'Invalid start parameter. Start must be before end.');
			return;
		}
	}
	if(startdate < 1403495605000 || startdate > Date.parse(new Date())){ //if the date preceeds server or is in the future
		res.send(403.10, 'Invalid start parameter. Start must be after 23/06/2014 and not in the future.');
		return;
	}else{
		req.query.start = new Date(startdate).toISOString();
		next();
	}
});

/*validate end param*/
apiRouter.param('end', function(req, res, next, end){
	req.query = req.query || {};
	var endDate = Date.parse(end);

	if(req.query.start){
		if(req.query.start > endDate){
			res.send(403.10, 'Invalid end parameter. End must be after start.');
			return;
		}
	}
	if(endDate < 1403495605000){ //if the date preceeds server
		res.send(403.10, 'Invalid end parameter. End must be at least after 23/06/2014.');
		return;
	}else{
		req.query.end = new Date(endDate).toISOString();
		next();
	}
});


/*declare exports*/
module.exports.apiRouter = apiRouter;
module.exports.analyticsRouter = analyticsRouter;