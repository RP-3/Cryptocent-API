var routers = require('../routes/routes.js');

module.exports = function(app){
	app.use('/api', routers.apiRouter);
	app.use('/', routers.analyticsRouter);
};