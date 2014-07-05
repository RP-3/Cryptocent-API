/*Initialise firebase connection*/
var Firebase = require('firebase');
var source = new Firebase('https://publicdata-cryptocurrency.firebaseio.com/');

//maintains latest exchange rate in memory
var rates = {bitcoin: {}, litecoin: {}, dogecoin: {}};
source.on('child_changed', function(snapshot){
    var data = snapshot.val(),
    name = snapshot.name();

    if(!rates[name].live){
        rates[name].live = true;
        console.log('Currency: ' + name + ' now live.');
    }

    rates[name].ask = snapshot.val().ask;
    rates[name].bid = snapshot.val().bid;
    rates[name].last = snapshot.val().last;
});

/*initialise sql connections*/
var sql = require('mssql');
var config = require('../config_dev.json').mssql_users;
var connection = new sql.Connection(config, function(err){
    if(err){
        console.log('Users database connection error:');
        console.log(err);
        process.exit();
    }else{
        console.log('Users database connection established.');
    }
});

/*sign in*/
var signIn = function(identifier, profile, done){
    var id = identifier.slice(identifier.indexOf('=')+1),
    name = profile.name.givenName,
    email = profile.emails[0].value,
    //check if user exists and create if not
    q = "if not exists (select * from traders where identifier = '"+ id +"') begin insert into traders (identifier, name, bitcoin, dogecoin, litecoin, usd, email) values ('"+ id +"', '"+ name +"', 1.0, 1.0, 1.0, 1000.0, '"+ email +"') end";

    var request = connection.request();
    request.query(q, function(err){
        done(err, id);
    });
};

//IMPORTANT! All requests below must be authed by some mechanism before execution!!

/*buy currency*/
var buy = function(currency, quantity, id, cb){
    //check sufficient account balance
    var cost = rates[currency].ask * quantity;
    var q = "declare @var int select @var = id from traders where identifier = '"+ id +"' if (select usd from traders where identifier = '"+ id +"') > "+ cost +" begin update traders set usd = usd - "+ cost +", "+ currency +" = "+ currency +" + "+ quantity +" where identifier = '"+ id +"' insert into transactions (currency, quantity, cost, transactor) values ('"+ currency +"', '"+ quantity +"', '"+ cost +"', @var) return end select usd from traders where identifier = '"+ id +"'";
    var request = connection.request();
    request.query(q, cb);
};

/*sell currency*/
var sell = function(currency, quantity, id){
    var price = rates[currency].bid * quantity;
    var q = "declare @var int select @var = id from traders where identifier = '"+ id +"' if (select "+ currency +" from traders where identifier = '"+ id +"') > "+ quantity +" begin update traders set usd = usd + "+ price +", "+ currency +" = "+ currency +" - "+ quantity +" where identifier = '"+ id +"' insert into transactions (currency, quantity, cost, transactor) values ('"+ currency +"', '"+ quantity +"', '"+ -price +"', @var) return end select "+ currency +" from traders where identifier = '"+ id +"'";
    var request = connection.request();
    request.query(q, function(err, data){
        if(!err){
            if(!data){
                console.log('Transaction complete.'); //req/response should go here or in else statement following
            }else{
                console.log('Insufficient currency: $', data[0][currency]);
            }
        }else{
            console.log('err: ', err);
        }
    });
};

/*delete user permanently*/
var deleteUser = function(id){
    var q = "declare @var int select @var = id from traders where identifier = '"+ id +"'  delete from traders where identifier = '"+ id +"' delete from transactions where id = @var";
    var request = connection.request();
    request.query(q, function(err, data){
        if(!err){
            console.log('User '+ id +' deleted');
        }else{
            console.log('err: ', err);
        }
    });
};

var getAccount = function(id, cb){
    var q = "select * from traders where identifier = '"+ id +"'";
    var request = connection.request();
    request.query(q, cb); //callback gets passed err, data
};

/*declare exports*/
module.exports.signIn = signIn;
module.exports.buy = buy;
module.exports.sell = sell;
module.exports.deleteUser = deleteUser;
module.exports.getAccount = getAccount;