var express = require('express');
var userRouter = express.Router();
var queries = require('./userQueries.js');

/*set up id check for router*/
userRouter.use(function(req, res, next){
    console.log(req.body.id);
    if(!req.body.id){
        res.send(403.10, 'Transactional requests must include an account id');
    }else{
        next();
    }
});

/*if requiring sessions for security, implement them here*/
userRouter.use(function(req, res, next){
    //add check to see if session matches req.body.id to lock down this router
    next();
});

var validateCurrAndQuant = function(req, res, next){
    var currency = req.body.currency;
    if(!(currency === 'bitcoin' || currency === 'litecoin' || currency === 'dogecoin')){
        var badCurr = new Error('Invalid currency parameter. Use "bitcoin", "litecoin" or "dogecoin".');
        badCurr.status = 403.10;
        return next(badCurr);
    }

    var quantity = req.body.quantity;
    if(!isNaN(parseFloat(quantity)) && parseFloat(quantity) < 1000000000){
        req.body.quantity = parseFloat(quantity);
    }else{
        var badQuant = new Error('quantity must be a valid float  and < a billion');
        badQuant.status = 403.1;
        return next(badQuant);
    }

    next();
};

/*validate currency and quantity params*/
userRouter.use('/buy', validateCurrAndQuant);
userRouter.use('/sell', validateCurrAndQuant);

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

userRouter.delete('/deleteAccount', function(req, res){
    queries.deleteUser()
});

userRouter.post('/ledger', function(req, res){ //get history of user transactions

});



/*declare exports*/
module.exports = userRouter;