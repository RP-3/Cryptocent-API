var express = require('express');
var userRouter = express.Router();
var queries = require('./userQueries.js');

/*set up authentication for router*/
userRouter.use(function(req, res, next){
    console.log(req.body.id);
    if(!req.body.id){
        res.send(400, 'Transactional requests must include an account id');
    }else{
        next();
    }
});

/*set up routes*/
userRouter.post('/account', function(req, res){ //get user's account
    queries.getAccount(req.body.id, function(err, data){
        if(err){
            res.send(500, 'Databse read error: ', err);
        }else if (data.length){
            res.send(data[0]);
        }else{
            res.send(400, 'account id not found in database');
        }
    });
});




/*declare exports*/
module.exports = userRouter;