var apiRouter = require('../routes/apiRouter.js');
var userRouter = require('../routes/userRouter.js');
var accountRouter = require('../routes/accountRouter.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./auth.js');

module.exports = function(app){
    /*standard middleware*/
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(session({ secret: 'fooBotFunkyTown'}));

    /*non-passport-protected routes*/
	app.use('/api', apiRouter);

    /*passport-specific middleware*/
    app.use(passport.initialize());
    app.use(passport.session());

    /*protected routes*/
    app.use('/api/transact', userRouter);
    app.use('/account', accountRouter);

    /*Authenticated get requests load client-side app (passport-protected)*/
    app.get('/console', passport.authenticate('google', {
        successRedirect: '/account', // '/account' should load client-side app
        failureRedirect: '/'}));

    /*all other get requests follow authentication loop*/
    app.get('/', passport.authenticate('google'));
};