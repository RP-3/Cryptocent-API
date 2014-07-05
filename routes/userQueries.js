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

/*generates a random number of given length*/
var hashGen = function(length){
    var hash = "";
    while(hash.length < length){
        hash = hash + Math.floor(Math.random() * 10);
    }
    return hash;
};

var signIn = function(identifier, profile, done){
    var id = identifier.slice(identifier.indexOf('=')+1);
    var profile = profile || {name: {givenName: 'Lazarus'}, emails: [{value: 'cybertrader@skynet.io'}]}; //create a profile object if one is not supplied (i.e., manually created profile)
    var name = profile.name.givenName;
    var email = profile.emails[0].value;
    var hash = hashGen(10);
    //check if user exists and create if not
    q = "if not exists (select * from traders where identifier = '"+ id +"') begin insert into traders (identifier, name, bitcoin, dogecoin, litecoin, usd, email, secret, timestamp) values ('"+ id +"', '"+ name +"', 1.0, 1.0, 1.0, 1000.0, '"+ email +"', '"+ hash +"', GETDATE()) end";

    var request = connection.request();
    request.query(q, function(err){
        done(err, id, hash);
    });
};

var buy = function(currency, quantity, id, cb){
    //check sufficient account balance
    var cost = rates[currency].ask * quantity;
    var q = "declare @var int select @var = id from traders where identifier = '"+ id +"' if (select usd from traders where identifier = '"+ id +"') > "+ cost +" begin update traders set usd = usd - "+ cost +", "+ currency +" = "+ currency +" + "+ quantity +" where identifier = '"+ id +"' insert into transactions (currency, quantity, cost, transactor) values ('"+ currency +"', '"+ quantity +"', '"+ cost +"', @var) return end select usd from traders where identifier = '"+ id +"'";
    var request = connection.request();
    request.query(q, cb); //callback gets passed err, data
};

var sell = function(currency, quantity, id, cb){
    var price = rates[currency].bid * quantity;
    var q = "declare @var int select @var = id from traders where identifier = '"+ id +"' if (select "+ currency +" from traders where identifier = '"+ id +"') > "+ quantity +" begin update traders set usd = usd + "+ price +", "+ currency +" = "+ currency +" - "+ quantity +" where identifier = '"+ id +"' insert into transactions (currency, quantity, cost, transactor) values ('"+ currency +"', '"+ quantity +"', '"+ -price +"', @var) return end select "+ currency +" from traders where identifier = '"+ id +"'";
    var request = connection.request();
    request.query(q, cb); //callback gets passed err, data
};

var deleteUser = function(id, cb){
    var q = "declare @var int select @var = id from traders where identifier = '"+ id +"'  delete from traders where identifier = '"+ id +"' delete from transactions where transactor = @var";
    var request = connection.request();
    request.query(q, cb);
};

var getAccount = function(id, cb){
    var q = "select * from traders where identifier = '"+ id +"'";
    var request = connection.request();
    request.query(q, cb); //callback gets passed err, data
};

var getHistory = function(id, cb){
    var q = "declare @var int select @var = id from traders where identifier = '"+ id +"' select * from transactions where transactor = @var order by timestamp asc";
    var request = connection.request();
    request.query(q, cb); //callback gets passed err, data
};

var exists = function(id, cb){
    var q = "select * from traders where identifier = '"+ id +"'";
    var request = connection.request();
    request.query(q, cb); //takes err, data
};

var updateTime = function(id, cb){
    var q = "update traders set timestamp = GETDATE() where identifier = '"+ id +"'";
    var request = connection.request();
    request.query(q, cb);
};

/*declare exports*/
module.exports.signIn = signIn;
module.exports.buy = buy;
module.exports.sell = sell;
module.exports.deleteUser = deleteUser;
module.exports.getAccount = getAccount;
module.exports.getHistory = getHistory;
module.exports.exists = exists;
module.exports.updateTime = updateTime;