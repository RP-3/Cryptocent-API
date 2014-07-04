var apiRouter = require('../routes/apiRouter.js');
var passport = require('./auth.js');

module.exports = function(app){
	app.use('/api', apiRouter);
	app.get('/', passport.authenticate('google'));
    app.get('/console', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/fail'}));
};