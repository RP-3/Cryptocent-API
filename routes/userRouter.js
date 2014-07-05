var express = require('express');
var userRouter = express.Router();
var queries = require('./userQueries.js');

/*set up id and parameter check for router. Broken out to keep this file short-ish*/
require('./transactionCheck.js')(userRouter);

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

userRouter.post('/buy', function(req, res){
    queries.buy(req.body.currency, req.body.quantity, req.body.id, function(err, data){
        if(!err){
            if(!data){
                queries.getAccount(req.body.id, function(err, data){ //if success, send snapshot of account
                    if(!err){
                        res.send(200, data[0]);
                    }
                });
            }else{
                res.send(405, 'Insufficient funds: $' + data[0].usd);
            }
        }else{
            res.send(500, err);
        }
    });
});

userRouter.post('/sell', function(req, res){
    queries.sell(req.body.currency, req.body.quantity, req.body.id, function(err, data){
        if(!err){
            if(!data){
                queries.getAccount(req.body.id, function(err, data){ //if success, send snapshot of account
                    if(!err){
                        res.send(200, data[0]);
                    }
                });
            }else{
                res.send(405, 'Insufficient currency: $' + data[0][currency]);
            }
        }else{
            res.send(500, err);
        }
    });
});

userRouter.delete('/deleteaccount', function(req, res){
    queries.deleteUser(req.body.id, function(err, data){
        if(!err){
            res.send(200, 'User '+ req.body.id +' permanently deleted');
        }else{
            res.send(500, err);
        }
    });
});

userRouter.post('/ledger', function(req, res){ //get history of user transactions
    queries.getHistory(req.body.id, function(err, data){
        if(!err){
            if(!data.length){
                res.send(400, 'account id not found in database');
            }else{
                res.send(200, data);
            }
        }else{
            res.send(500, err);
        }
    });
});

userRouter.post('/create', function(req, res){
    var temp = '='+req.body.id;
    queries.signIn(temp, null, function(err, id, hash){
        if(!err){
            res.send(200, {identifier: id, secret: hash});
        }else{
            res.send(500, err);
        }
    });
});

/*declare exports*/
module.exports = userRouter;