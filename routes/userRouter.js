var express = require('express');
var userRouter = express.Router();
var queries = require('./userQueries.js');

/*set up id authentication for router*/
userRouter.use(function(req, res, next){
    console.log(req.body.id);
    if(!req.body.id){
        res.send(403.10, 'Transactional requests must include an account id');
    }else{
        next();
    }
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
    
});

userRouter.post('/sell', function(req, res){

});

/*declare exports*/
module.exports = userRouter;