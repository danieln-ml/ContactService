var carbon = require('carbon-io')
var o   = carbon.atom.o(module).main
var _o  = carbon.bond._o(module)
var __  = carbon.fibers.__(module).main

/**************************************************************************
 * ContactsApi
 */
__(function() {
  module.exports = o({

    /**********************************************************************
     * _type
     */
    _type: carbon.carbond.Service,
    
    /**********************************************************************
     * description
     */        
    description: "API for managing Contacts",

    /**********************************************************************
     * port
     */
    port: 9900,

    /**********************************************************************
     * authenticator
     */
    authenticator: o({
      _type: carbon.carbond.security.MongoDBApiKeyAuthenticator,
      apiKeyParameterName: "Api-Key",
      apiKeyLocation: "header", 
      userCollection: "users",
      apiKeyField: "apiKey"
    }),
    
    /**********************************************************************
     * dbUri
     */
    dbUri: 'mongodb://localhost:27017/contacts',

    /**********************************************************************
     * endpoints
     *
     * The URL structure for this API will be:
     *
     * /users
     * /users/:user
     * /users/:user/contacts
     * /users/:user/contacts/:contact
     * 
     * The ContactsEndpoint is registered as a child endpoint of the
     * UsersEndpoint in UsersEndpoint.js.
     */
    endpoints : {
      users: _o('./UsersEndpoint')
    }
  })
})





