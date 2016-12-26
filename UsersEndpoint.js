var carbon   = require('carbon-io')
var o        = carbon.atom.o(module)
var _o       = carbon.bond._o(module)
var _        = require('lodash')

/**********************************************************************************************************************
 * UsersEndpoint
 *
 * This is the /users Endpoint. It is a Collection. It is also the root 
 * endpoint for all other endpoints (i.e. /users/:user/contacts)
 * 
 * One core function of the Enpoint is to enforce the security contraint 
 * that req.user._id === :user for all sub-endpoints (except for 
 * admin users). It does this via an acl that is a CollectionAcl with 
 * 'selfAndBelow' set to true. 
 */
module.exports = o({

  /****************************************************************************************************************
   * _type
   */
  _type: carbon.carbond.collections.Collection,

  /****************************************************************************************************************
   * enabled 
   */
  enabled: {
    'find': false,
    'insert': true, 
    'update': false,      // We do not support bulk updates to this collection
    'remove': false,      // We do not support bulk removes to this collection
    'findObject': true,
    'saveObject': false,  
    'updateObject': true, // We do not allow for saving the whole object, only select updates
    'removeObject': true,
  },

  /****************************************************************************************************************
   * idPathParameter
   *
   * This is how we define the path parameter to be :user in /users/:user
   */
  idPathParameter: 'user',

  /****************************************************************************************************************
   * allowUnauthenticated // XXX This is not how this should be done
   */
  allowUnauthenticated: ['post'],

  /****************************************************************************************************************
   * collection
   *
   * The name of the MongoDB collection storing Users.
   */
  collection: 'users',

  /****************************************************************************************************************
   * schema
   *
   * This is the schema for User objects handled by this Endpoint. Schema for insert will differ from this
   * allowing only for a subset of the User fields to be defined by clients (i.e. fields like 'admin' and 'apiKey'
   * are generated via system and not specified by client on insert). 
   */
  schema: {
    type: "object",
    properties: {
      _id: { type: 'string' },
      email: { type: 'string', format: 'email' },
      apiKey: { type: 'string' } 
    },
    required: [ '_id', 'email', 'apiKey' ], // XXX we want to show API Key?
    additionalProperties: false
  },
  
  /****************************************************************************************************************
   * acl
   *
   * This acl ensures that the entire /users/:user subtree disallows access unless the 
   * authenticated user owns the user or is an admin.
   */
  acl: o({
    _type: carbon.carbond.security.CollectionAcl,

    selfAndBelow: true, // Govern this Endpoint and all descendant Endpoints. Very important.

    groupDefinitions: {
      admin: 'admin'
    },

    entries: [
      {
        user: { admin: true }, // If the user is an admin (user.admin === true), then grant all permissions.
        permissions: {
          '*': true
        }
      },

      {
        // All other Users
        user: '*',
        permissions: {
          // XXX maybe refactor this example so that not all about '*', maybe add find: false, ...
          // For all operations, make sure the user id is the same as the authenticated user
          '*': function(user, env) {
            var userId = env.req.parameters['user']
            if (userId) {
              return user._id === userId
            }

            // If there is no userId parameter, this is a collection-level operation. 
            // We return false here to prevent a non-admin user from listing all users
            // or executing other collection level operations. 
            return false
          }
        }
      }
    ]

  }),

  /****************************************************************************************************************
   * idGenerator
   */
  idGenerator: o({
    _type: carbon.carbond.ObjectIdGenerator,
    generateStrings: true
  }),

  /****************************************************************************************************************
   * passwordHasher
   */
  /*
  passwordHasher: o({
    _type: carbon.carbond.security.Hasher.getHasher('bcrypt'), // XXX want to streamline this
    rounds: 8 // This is if you want to be fancy. You don't have to configure this. The default is 10.
  }),
*/
  /****************************************************************************************************************
   * endpoints
   *
   * SECURITY: It is semantically important that these are defined as child 
   * Endpoints of this Endpoint so that the acl for this Endpoint will govern 
   * them. If these definitions were moved to top-level, for instance, this
   * would not be the case. 
   */
  endpoints: {
    'contacts': _o('./ContactsEndpoint')
  },

  /****************************************************************************************************************
   * insertConfig
   */
  insertConfig: {
    allowUnauthenticated: true, // This operation disables authentication. It is how new users are made.

    insertSchema: { // This is the schema for posting to /users. New users simply post email and password.
      type: "object",
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: [ 'email', 'password' ],
      additionalProperties: false
    }
  },

  /****************************************************************************************************************
   * insert
   */
  insert: function(obj) { 
    var user = {
      _id: obj._id, // Since we have an idGenerator configured _id will exist
      email: obj.email,
//      password: this.passwordHasher.hash(obj.password),
      password: "foobar",
      // XXX is this bad crypto? Can one guess API Keys?
      apiKey: this.service.authenticator.generateApiKey(), // Gen a new API Key using the APIKeyAuthenticator
      admin: false
    }
//    console.log(user)
    var result = this.getCollection().insert(user).ops[0] // XXX Change leafnode so this is not necessary and catch err
    result = this._publicUserView(result, true) // View? Should we pass true?
    return result
  },

  /****************************************************************************************************************
   * findObject
   */
  findObject: function(id) {
    // SECURITY: This is secured by virtue of the CollectionAcl defined
    // on this Collection endpoint which ensures this id (/users/:id) is the same as the 
    // authenticated User's _id or the User is an admin. 
    var result = this.getCollection().findOne({ _id: id })
    return this._publicUserView(result, true)
  },

  /****************************************************************************************************************
   * updateObjectConfig
   */
  updateObjectConfig: {
    // SECURITY: This is secured by virtue of the CollectionAcl defined
    // on this Collection endpoint which ensures this id (/users/:id) is the same as the 
    // authenticated User's _id or the User is an admin. 

    // For security reasons it is important to only allow the user to update some fields. 
    updateSchema: {
      type: "object",
      properties: {
        password: { type: 'string' },
        email: { type: 'string', format: 'email' }
      },
      additionalProperties: false
    }
  },

  /****************************************************************************************************************
   * updateObject
   */
  updateObject: function(id, update) {
    // SECURITY: This is secured by virtue of the CollectionAcl defined
    // on this Collection endpoint which ensures this id (/users/:id) is the same as the 
    // authenticated User's _id or the User is an admin. 
    var result = this.getCollection().update({_id : id}, {$set: update}) // XXX A lot is riding on that schema being right
    // XXX if they update password need to re-hash
    return result.result.n === 1 // XXX fix this. 
  },

  /****************************************************************************************************************
   * removeObject
   */
  removeObject: function(id) {
    // SECURITY: This is secured by virtue of the CollectionAcl defined
    // on this Collection endpoint which ensures this id (/users/:id) is the same as the 
    // authenticated User's _id or the User is an admin. 
    var result = this.getCollection().remove({ _id: id }) // XXX 404 if not there?
    return result.result.n === 1 // XXX fix this. 
  },

  /****************************************************************************************************************
   * getCollection
   */
  getCollection: function() {
    return this.service.db.getCollection(this.collection)
  },

  /****************************************************************************************************************
   * _publicUserView
   */
  _publicUserView: function(obj, apiKey) {
    var result = {
      _id: obj._id,
      email: obj.email
    }

    if (apiKey) {
      result.apiKey = obj.apiKey
    }
    return result
  }

})
