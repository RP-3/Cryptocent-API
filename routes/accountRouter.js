var express = require('express');
var accountRouter = express.Router();
var userQueries = require('./userQueries.js');

/*eventually there'll be a client-side app served from here*/
accountRouter.use(function(req, res, next){
    var id = req.session.passport.user;
    userQueries.exists(id, function(err, data){
        //user already exists and matches against session
        if(data.length && data[0].identifier === id){
            res.writeHead(302, {'Location': 'http://localhost:3000/?id=' + id});
            res.end();
        }else{
            res.redirect('/'); //user doesn't match against session. redirect.
        }
    });
});

module.exports = accountRouter;