Cryptocent-API
==========

Read this in a normal text editor. I haven't mark-down-ified this.

RESTful server returning historical crypto-currency exchange rates from July 2014. 

Intended for HRX and current HR student use.

*****************************

Repo structure:

Root->
  -app.js -> main server file
  
  -config -> config.js:     contains all settings for main server file including routers and middleware
          -> auth.js:       initialises passport and contains authentication settings for Google Oauth
          
  -public -> :              //TOO: front-end angular app should go here using new structure
  
  -routes -> apiQueries.js: modularised helper functions (MSSQL queries) to get historical currency rates from server
          -> apiRouter.js:  router connecting helper functions to make API
          
          -> userQueries.js:modularised helper functions (queries) to create/delete users, buy and sell currency
          -> userRouter.js  ://TO DO: router wiring up helper functions to make user-facing API
          
 -config_dev.json -> Ask RP for this. It's been .gitIgnored. 
 *****************************

Using the API:

Before anything:
1. Get config_dev.json from RP-3 and save it to the repo's root
2. npm install
3. node app.js

Fetching data:
-Fetching data requires no auth or account. 
-There are three GET endpoints to choose from: /minly , /hourly , /daily
  -Minly returns all historical values for that currency in the time range given, to a maximum of 2000 records per request
  -Hourly returns the hourly average, for all hours in the time range given, to a maximum of 2000 records per request
  -Daily returns the daily average, for all days in the time range given. No maximum records per request
  
    -All three endpoints take the parameters 'currency', 'start' and 'end' and are MANDATORY.
    -currency is a two-character string representing the currency you want (i.e., 'bi' for bitcoin, 'li' for litecoin, 'do' for dogecoin)
    -start and end MUST be UTC strings. Easiest way to generate this is new Date().toUTCString();

-Example
/minly/bi/2014-06-25T20:11:08.246Z/2014-06-25T20:16:39.868Z 
//will return all bitcoin records between 25 June @ 11:08 and 26 June @ 20:16. 

/hourly/li/2014-06-25T20:11:08.246Z/2014-06-25T20:16:39.868Z 
//will return the hourly average of all litecoin records between 25 June @ 11:08 and 26 June @ 20:16

Accounts and trading:
-Visiting localhost:3000/ will redirect to google sign in
-Signing in will auto-create an account
-You can only mess with your own account

TODO: wire these up to API endpoints in a new router file. Helper functions currently exist to buy and sell currency, and delete accounts. Need to add a few more helpers to get account details, so that endpoints will return before and after snapshots of user's accounts. 
