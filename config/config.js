var apiRouter = require('../routes/apiRouter.js');
var analyticsRouter = require('../routes/analyticsRouter.js');

module.exports = function(app){
	app.use('/api', apiRouter);
	app.use('/', analyticsRouter);
};