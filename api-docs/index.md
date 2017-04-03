# Service


API for managing Contacts


<pre>

Usage: ContactService.js &lt;command&gt; [options]

command     
  start-server        start the api server
  gen-static-docs     generate docs for the api

Options:
   -v VERBOSITY, --verbosity VERBOSITY   verbosity level (trace | debug | info | warn | error | fatal)

Environment variables: 
  DB_URI - URI for the MongoDB database to connect to. Defaults to &#x27;mongodb://localhost:27017/contacts&#x27;

</pre>


## Endpoints

* [/users](/api-docs/users.md) 
* [/users/:user](/api-docs/users/:user.md) 
* [/users/:user/contacts](/api-docs/users/:user/contacts.md) 
* [/users/:user/contacts/:_id](/api-docs/users/:user/contacts/:_id.md) 


