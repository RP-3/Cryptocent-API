var express = require('express');
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
    //has it's own auth check (transactionCheck.js) that checks for EITHER passport session OR secret in request.body
    //used by browers AND as API endpoint so can be authed by passport OR secret

    app.use('/account', accountRouter);
    //will check for session added by passport and route accordingly. 
    //only used by browers so MUST be authed by passport, nothing else.

    app.get('/console', passport.authenticate('google', { //passport.authenticate forces session to be added before proceeding to success redirect
        successRedirect: '/account', // '/account' should load client-side app, but passing a queryString if authenticated and no QS if not
        failureRedirect: '/'}));

    /*catch-all route to serve client-side app*/
    app.use('/', express.static(__dirname + '/../public/'));
};