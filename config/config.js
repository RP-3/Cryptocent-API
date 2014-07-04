var apiRouter = require('../routes/apiRouter.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./auth.js');

module.exports = function(app){
    /*standard middleware*/
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(session({ secret: 'fooBotFunkyTown'}));

    /*non-protected routes*/
	app.use('/api', apiRouter);

    /*passport-specific middleware*/
    app.use(passport.initialize());
    app.use(passport.session());

    /*Authenticated requests load client-side app (protected)*/
    app.get('/console', passport.authenticate('google', {
        successRedirect: '/account',
        failureRedirect: '/'}));

    /*all other requests follow authentication loop*/
    app.get('/', passport.authenticate('google'));
};