var queries = require('./userQueries.js');

/*authentication middleware*/
var checkSessionOrsecret = function(req, res, next){
    //if the request is to create an account, go ahead
    if(req.path === '/create'){
      next();
    }
    //if the request is coming from an authenticated browser, let it through
    //Note: the brower must include the session in it's transact API requests
    else if(req.session.passport.user === req.body.id){
        next();
    }else{
    //not from a browser. lookup the secret to make sure it matches
        queries.getAccount(req.body.id, function(err, data){
            if(!err && data.length){
                if(data[0].secret === req.body.secret){
                    next();
                }else{
                    res.send(401, "API requests must include the identifier's secret");
                }
            }else{
                res.send(401, 'Server failed to authenticate');
            }
        });
    }
};

/*parameter validation middleware*/
var validateCurrAndQuant = function(req, res, next){
    var currency = req.body.currency; //function to make sure currency and quantity are not stupid
    if(!(currency === 'bitcoin' || currency === 'litecoin' || currency === 'dogecoin')){
        var badCurr = new Error('Invalid currency parameter. Use "bitcoin", "litecoin" or "dogecoin".');
        badCurr.status = 403.10;
        return next(badCurr);
    }

    var quantity = req.body.quantity;
    if(!isNaN(parseFloat(quantity)) && parseFloat(quantity) < 1000000000 && parseFloat(quantity) > 0){
        req.body.quantity = parseFloat(quantity);
    }else{
        var badQuant = new Error('quantity must be a valid float && 0 < float < a billion');
        badQuant.status = 403.1;
        return next(badQuant);
    }

    next();
};

/*export function that adds above checks and validation to given router*/
module.exports = function(router){
    router.use(function(req, res, next){
        if(!req.body.id){
            res.send(401, 'Transactional requests must include an account id');
        }else{
            next();
        }
    });
    router.use(checkSessionOrsecret);
    router.use('/buy', validateCurrAndQuant);
    router.use('/sell', validateCurrAndQuant);
};