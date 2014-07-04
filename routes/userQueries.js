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
    email = profile.emails[0],
    //check if user exists and create if not
    q = "if not exists (select * from traders where identifier = '"+ id +"') begin insert into traders (identifier, name, bitcoin, dodgecoin, litecoin, usd, email) values ('"+ id +"', '"+ name +"', 1.0, 1.0, 1.0, 1000.0, '"+ email +"') end";

    var request = connection.request();
    request.query(q, function(err){
        done(err, id);
    });
};

/*buy currency*/
//check sufficient account balance
//subtract dollar from dollars
//quant = rate * dollar
//add quant to currency

/*sell currency*/
//check sufficient currency balance
//subtract quant from currency
//dollar = quant / rate
//add dollar to dollars

/*create user*/
//create user entry
    //save gid, token, 
    //default to one of each currency && $1,000
    //last to null
//save user entry to DB

/*delete user*/
//delete user from users table
//find user entries in transaction table and delete them too

module.exports.signIn = signIn;