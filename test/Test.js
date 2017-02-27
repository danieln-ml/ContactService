var carbon = require('carbon-io')
var o      = carbon.atom.o(module).main
var _o     = carbon.bond._o(module)
var __     = carbon.fibers.__(module).main
var assert = require('assert')

/***************************************************************************************************
 * Test
 */
__(function() {
  module.exports = o({

    /***************************************************************************
     * _type
     */
    _type: carbon.carbond.test.ServiceTest,

    /***************************************************************************
     * name
     */
    name: "Contacts API Test",

    /***************************************************************************
     * service
     */
    service: _o('../ContactsApi'),
  
    /***************************************************************************
     * setup
     */
    setup: function() {
      carbon.carbond.test.ServiceTest.prototype.setup.call(this)
      TEST_USER_ID = undefined
      TEST_USER_API_KEY = undefined
      this.service.db.command({dropDatabase: 1})
    },

    /***************************************************************************
     * teardown
     */
    teardown: function() {
      this.service.db.command({dropDatabase: 1})
      carbon.carbond.test.ServiceTest.prototype.teardown.call(this)
    },

    /***************************************************************************
     * suppressServiceLogging
     */
    suppressServiceLogging: true,

    /***************************************************************************
     * tests
     */
    tests: [
      // Test adding a user
      {
        reqSpec: {
          url: '/users',
          method: "POST",
          body: {
            email: "bob@jones.com",
            password: "pass"
          }
        },
        resSpec: {
          statusCode: 201,
          body: function(body) {
            assert(body.email === 'bob@jones.com')
          },
        }
      },

      // Test that we can lookup that user
      {
        name: "GET /users/:_id",
        reqSpec: function(context) { // We need the previous response to get the _id
          var testUser = context.httpHistory.getRes(0).body
          return {
            url: `/users/${testUser._id}`,
            method: "GET",
            headers: {
              'Api-Key': testUser.apiKey
            }
          }
        },
        resSpec: {
          statusCode: 200,
          body: function(body, context) {
            var testUser = context.httpHistory.getRes(0).body
            assert(body._id == testUser._id)
            assert(body.email === "bob@jones.com")
          }
        }
      },

      // Test updating user
      {
        name: "PATCH /users/:_id",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          return {
            url: `/users/${testUser._id}`,
            method: "PATCH",
            headers: {
              'Api-Key': testUser.apiKey
            },
            body: {
              email: "bobby@jones.com",
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },

      // Test update worked
      {
        name: "GET /users/:_id",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          return {
            url: `/users/${testUser._id}`,
            method: "GET",
            headers: {
              'Api-Key': testUser.apiKey
            }
          }
        },
        resSpec: {
          statusCode: 200,
          body: function(body) {
            assert(body.email === "bobby@jones.com")
          }
        }
      },

      // Test adding a Contact
      {
        name: "POST /users/:user/contacts",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          return {
            url: `/users/${testUser._id}/contacts`,
            method: "POST",
            headers: {
              'Api-Key': testUser.apiKey
            },
            body: {
              firstName: "Mary",
              lastName: "Smith",
              email: "mary@smith.com",
              phoneNumbers: {
                mobile: "415-555-5555"
              }
            }
          }
        },
        resSpec: {
          statusCode: 201
        }
      },

      // Test finding that contact by email
      {
        name: "POST /users/:user/contacts",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          return {
            url: `/users/${testUser._id}/contacts`,
            method: "GET",
            headers: {
              'Api-Key': testUser.apiKey
            },
            parameters: {
              query: "mary@smith.com"
            }
          }
        },
        resSpec: {
          statusCode: 200,
        }
      },

      // Lookup previous object by _id and check they are the same
      {
        name: "GET /users/:user/contacts/:_id",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          var previousResponse = context.httpHistory.getRes(-1)
          return {
            url: `/users/${testUser._id}/contacts/${previousResponse.body[0]._id}`,
            method: "GET",
            headers: {
              'Api-Key': testUser.apiKey
            }
          }
        },
        resSpec: function(response, context) {
          var previousResponse = context.httpHistory.getRes(-1)
          assert.deepEqual(response.body, previousResponse.body[0])
        }
      },

      // Test saving the contact
      {
        name: "PUT /users/:user/contacts/:_id",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          var previousResponse = context.httpHistory.getRes(-1)
          return {
            url: `/users/${testUser._id}/contacts/${previousResponse.body._id}`,
            method: "PUT",
            headers: {
              'Api-Key': testUser.apiKey
            },
            body: {
              _id: previousResponse.body._id,
              firstName: "Mary",
              lastName: "Smith",
              email: "mary.smith@gmail.com",
              phoneNumbers: {
                mobile: "415-555-5555"
              }
            }
          }
        },
        resSpec: {
          statusCode: 200,
        }
      },

      // Test removing the contact
      {
        name: "DELETE /users/:user/contacts/:_id",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          var testContact = context.httpHistory.getRes(-2).body
          return {
            url: `/users/${testUser._id}/contacts/${testContact._id}`,
            method: "DELETE",
            headers: {
              'Api-Key': testUser.apiKey
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },

      // Test DELETE /users/:_id worked (save this for the end of the test run)
      {
        name: "DELETE /users/:_id",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          return {
            url: `/users/${testUser._id}`,
            method: "DELETE",
            headers: {
              'Api-Key': testUser.apiKey
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },

      // Test DELETE /users/:_id worked by checking if user is gone
      {
        name: "GET /users/:_id",
        reqSpec: function(context) {
          var testUser = context.httpHistory.getRes(0).body
          return {
            url: `/users/${testUser._id}`,
            method: "GET",
            headers: {
              'Api-Key': testUser.apiKey
            }
          }
        },
        resSpec: {
          statusCode: 401 // Since user is gone we don't get a 404. We can't even authenticate!
        }
      },

    ]

  })
})
