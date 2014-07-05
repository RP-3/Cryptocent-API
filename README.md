Cryptocent-API
==========

RESTful server returning historical crypto-currency exchange rates from July 2014. 

***

### Repo structure:

  - app.js: main server file
  
  - config 
    - config.js: contains all settings for main server file including routers and middleware
    - auth.js: initialises passport and contains authentication settings for Google Oauth
  - public 
    - //TOO: front-end angular app should go here using new structure
  - routes 
    - apiQueries.js: modularised helper functions (MSSQL queries) to get historical currency rates from server
    - apiRouter.js:  router connecting helper functions to make API     
    - userQueries.js:modularised helper functions (queries) to create/delete users, buy and sell currency
    - userRouter.js: router wiring up helper functions to make user-facing API
  - config_dev.json -> Ask RP for this. It's been .gitignored. 

 ***

### Using the API:
1. Get config_dev.json from RP-3 and save it to the repo's root
2. npm install
3. node app.js

#### Fetching data:
- Fetching data requires no auth or account. 
- There are three GET endpoints to choose from: /minly , /hourly , /daily
  - Minly returns all historical values for that currency in the time range given, to a maximum of 2000 records per request
  - Hourly returns the hourly average, for all hours in the time range given, to a maximum of 2000 records per request
  - Daily returns the daily average, for all days in the time range given. No maximum records per request
    - All three endpoints take the parameters 'currency', 'start' and 'end' which are MANDATORY.
    - currency is a two-character string representing the currency you want (i.e., 'bi' for bitcoin, 'li' for litecoin, 'do' for dogecoin)
   - start and end MUST be UTC-formatted strings. Easiest way to generate this is new Date().toUTCString();

- Example 1

/minly/bi/2014-06-25T20:11:08.246Z/2014-06-25T20:16:39.868Z 
//will return all bitcoin records between 25 June @ 11:08 and 26 June @ 20:16. 

- Example 2

/hourly/li/2014-06-25T20:11:08.246Z/2014-06-25T20:16:39.868Z 
//will return the hourly average of all litecoin records between 25 June @ 11:08 and 26 June @ 20:16

#### Accounts and trading:
- Visiting localhost:3000/ will redirect to google sign in
  - Signing in will auto-create an account and show you your account's identifier and secret.
  - Your account is created with one bitcoin, one dogecoin, one litecoin and $1,000
- There are five POST endpoints: (/buy /sell /account /ledger /create) and one DELETE endpoint /deleteaccount
- All requests must have: 
  - an 'id' attribute on req.body that corresponds to your account's identifier
  - a 'secret' attribute on req.body that corresponds to your account's identifier's secret

- To buy or sell cryptocurrency:
  - send a POST request to /transact/buy or /transact/sell
  - the body of your post request (req.body) MUST have the following properties
    - id: your account's identifier
    - secret: your account's identifier's secret
    - currency: the COMPLETE, lowercase string of the currency you want to buy/sell (e.g., 'bitcoin' or 'litecoin')
    - quantity: the numerical value representing the quantity of currency you want to buy. This must be less than 1 billion and may be precise up to only 8 decimal places

- To view your account or transaction history:
  - send a POST request to /transact/account or /transact/ledger
  - the body of your post request (req.body) MUST have the properties 
    - id: your account's identifier
    - secret: your account's identifier's secret

- To delete your account permanently:
  - send a DELETE request to /transact/deleteaccount
  - the body of your delete request (req.body) MUST have the properties 
    - id: your account's identifier
    - secret: your account's identifier's secret

- To create a new account manually:
  - send a POST request to /transact/create
  - the body of your post request (req.body) MUST have the property id: a string of less than 20 characters
  - the server will return your id and a secret assigned to it. Unlike auto-created accounts (see below) this secret can NEVER be communicated again if lost. You MUST SAVE IT PROGRAMMATICALLY.

#### Use Notes:
- If your account was created automatically by signing in with google, you can retrieve your account details including identifier and secret at any time by revisiting the home page and signing in with google. 
- This service is designed to simulate high-frequency trading. If no API endpoints are hit on an account for 24 hours, the account will be deleted permanently. We're letting you programatically create multiple accounts in case you want to do something crazy with genetic algorithms or something. The 24-hour cutoff is a necessary consequence of that, or we'll have billions of idle accounts :)
