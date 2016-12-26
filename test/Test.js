var carbon = require('carbon-io')
var o      = carbon.atom.o(module).main
var _o     = carbon.bond._o(module)
var __     = carbon.fibers.__(module).main
var assert = require('assert')

/***************************************************************************************************
 * TEST_USER_ID
 *
 * Module variable to hold the _id of the test User object we create. Helpful since _id values
 * are auto-generated. 
 */
var TEST_USER_ID = undefined

/***************************************************************************************************
 * TEST_USER_API_KEY
 *
 * Module variable to hold the apiKey of the test User object we create. Helpful since these values
 * are auto-generated. 
 */
var TEST_USER_API_KEY = undefined

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
            // XXX we want to assert more here 
            return true
          },
        }
      },

      // Test that we can lookup that user
      {
        name: "GET /users/:_id",
        reqSpec: function(previousResponse) { // We need the previous response to get the _id
          // Here we will remember the _id of the user via TEST_USER_ID
          TEST_USER_ID = previousResponse.body._id
          TEST_USER_API_KEY = previousResponse.body.apiKey
          return {
            url: `/users/${TEST_USER_ID}`,
            method: "GET",
            headers: {
              'Api-Key': previousResponse.body.apiKey
            }
          }
        },
        resSpec: {
          statusCode: 200,
          body: function(body) {
            assert(body._id == TEST_USER_ID)
            assert(body.email === "bob@jones.com")
            return true
          }
        }
      },

      // Test updating user
      {
        name: "PATCH /users/:_id",
        reqSpec: function() {
          return {
            url: `/users/${TEST_USER_ID}`,
            method: "PATCH",
            headers: {
              'Api-Key': TEST_USER_API_KEY
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
        reqSpec: function() {
          return {
            url: `/users/${TEST_USER_ID}`,
            method: "GET",
            headers: {
              'Api-Key': TEST_USER_API_KEY
            }
          }
        },
        resSpec: {
          statusCode: 200,
          body: function(body) {
            assert(body.email === "bobby@jones.com")
            return true
          }
        }
      },

      // Test adding a Contact
      {
        name: "POST /users/:user/contacts",
        reqSpec: function() {
          return {
            url: `/users/${TEST_USER_ID}/contacts`,
            method: "POST",
            headers: {
              'Api-Key': TEST_USER_API_KEY
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
        reqSpec: function() {
          return {
            url: `/users/${TEST_USER_ID}/contacts`,
            method: "GET",
            headers: {
              'Api-Key': TEST_USER_API_KEY
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
        reqSpec: function(previousResponse) {
          return {
            url: `/users/${TEST_USER_ID}/contacts/${previousResponse.body[0]._id}`,
            method: "GET",
            headers: {
              'Api-Key': TEST_USER_API_KEY
            }
          }
        },
        resSpec: function(response, previousResponse) {
          assert.deepEqual(response.body, previousResponse.body[0])
          return true
        }
      },

      // Test saving the contact
      {
        name: "PUT /users/:user/contacts/:_id",
        reqSpec: function(previousResponse) {
          return {
            url: `/users/${TEST_USER_ID}/contacts/${previousResponse.body._id}`,
            method: "PUT",
            headers: {
              'Api-Key': TEST_USER_API_KEY
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

      /* XXX this is not working
      // Test removing the contact
      {
        name: "DELETE /users/:user/contacts/:_id",
        reqSpec: function(previousResponse) {
          return {
            url: `/users/${TEST_USER_ID}/contacts/${previousResponse.body._id}`,
            method: "DELETE",
            headers: {
              'Api-Key': TEST_USER_API_KEY
            }
          }
        },
        resSpec: {
          statusCode: 200
        }
      },
      */

      // Test DELETE /users/:_id worked (save this for the end of the test run)
      {
        name: "DELETE /users/:_id",
        reqSpec: function() {
          return {
            url: `/users/${TEST_USER_ID}`,
            method: "DELETE",
            headers: {
              'Api-Key': TEST_USER_API_KEY
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
        reqSpec: function() {
          return {
            url: `/users/${TEST_USER_ID}`,
            method: "GET",
            headers: {
              'Api-Key': TEST_USER_API_KEY
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
