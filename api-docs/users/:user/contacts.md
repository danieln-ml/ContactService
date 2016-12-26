[back to ToC](/api-docs/index.md)

## /users/:user/contacts


### `GET`

Find objects in this Collection.
### Parameters

---

<table>
<tr>
<th> name </th>
<th> description </th>
<th> required </th>
<th> location </th>
<th> default </th>
<th> schema </th>
</tr>



<tr>
<td valign="top"> user </td>
<td valign="top"> Object _id </td>
<td valign="top"> yes </td>
<td valign="top"> path </td>
<td valign="top"> 
<code>null</code>
</td>
<td valign="top">
<pre><code>{
  "type": "string"
}
</code></pre>
</td>
</tr>




<tr>
<td valign="top"> query </td>
<td valign="top"> Query spec (JSON) </td>
<td valign="top"> no </td>
<td valign="top"> query </td>
<td valign="top"> 
<code>null</code>
</td>
<td valign="top">
<pre><code>{
  "type": "string"
}
</code></pre>
</td>
</tr>



<tr>
<td valign="top"> view </td>
<td valign="top"> View </td>
<td valign="top"> no </td>
<td valign="top"> query </td>
<td valign="top"> 
<code>null</code>
</td>
<td valign="top">
<pre><code>{
  "type": "string"
}
</code></pre>
</td>
</tr>



</table>


### Responses

---

<table>
<tr>
<th> status code </th>
<th> description </th>
<th> headers </th>
<th> schema </th>
</tr>
<tr>
<td>
200
</td>
<td>
Returns an array of objects. Each object has an _id and possible additional properties.
</td>
<td>
<pre>null
</pre>
</td>
<td>
<pre><code>{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "_id": {
        "type": "string"
      },
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "email": {
        "type": "string",
        "format": "email"
      },
      "phoneNumbers": {
        "type": "object",
        "properties": {
          "home": {
            "type": "string"
          },
          "work": {
            "type": "string"
          },
          "mobile": {
            "type": "string"
          }
        }
      }
    },
    "required": [
      "_id",
      "firstName"
    ],
    "additionalProperties": false
  }
}
</code></pre>
</td>
</tr>
<tr>
<td>
400
</td>
<td>
Request is malformed (i.e. invalid parameters).
</td>
<td>
<pre>null
</pre>
</td>
<td>
<pre><code>{
  "type": "object",
  "properties": {
    "code": {
      "type": "integer"
    },
    "description": {
      "type": "string"
    },
    "message": {
      "type": "string"
    }
  },
  "required": [
    "code",
    "description",
    "message"
  ]
}
</code></pre>
</td>
</tr>
<tr>
<td>
403
</td>
<td>
User is not authorized to run this operation.
</td>
<td>
<pre>null
</pre>
</td>
<td>
<pre><code>{
  "type": "object",
  "properties": {
    "code": {
      "type": "integer"
    },
    "description": {
      "type": "string"
    },
    "message": {
      "type": "string"
    }
  },
  "required": [
    "code",
    "description",
    "message"
  ]
}
</code></pre>
</td>
</tr>
<tr>
<td>
500
</td>
<td>
There was an unexpected internal error processing this request.
</td>
<td>
<pre>null
</pre>
</td>
<td>
<pre><code>{
  "type": "object",
  "properties": {
    "code": {
      "type": "integer"
    },
    "description": {
      "type": "string"
    },
    "message": {
      "type": "string"
    }
  },
  "required": [
    "code",
    "description",
    "message"
  ]
}
</code></pre>
</td>
</tr>
</table>
### `POST`

Insert an object into this Collection.
### Parameters

---

<table>
<tr>
<th> name </th>
<th> description </th>
<th> required </th>
<th> location </th>
<th> default </th>
<th> schema </th>
</tr>



<tr>
<td valign="top"> user </td>
<td valign="top"> Object _id </td>
<td valign="top"> yes </td>
<td valign="top"> path </td>
<td valign="top"> 
<code>null</code>
</td>
<td valign="top">
<pre><code>{
  "type": "string"
}
</code></pre>
</td>
</tr>




<tr>
<td valign="top"> body </td>
<td valign="top"> Object to insert </td>
<td valign="top"> yes </td>
<td valign="top"> body </td>
<td valign="top"> 
<code>null</code>
</td>
<td valign="top">
<pre><code>{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "phoneNumbers": {
      "type": "object",
      "properties": {
        "home": {
          "type": "string"
        },
        "work": {
          "type": "string"
        },
        "mobile": {
          "type": "string"
        }
      }
    }
  },
  "required": [
    "firstName"
  ],
  "additionalProperties": false
}
</code></pre>
</td>
</tr>



</table>


### Responses

---

<table>
<tr>
<th> status code </th>
<th> description </th>
<th> headers </th>
<th> schema </th>
</tr>
<tr>
<td>
201
</td>
<td>
Returns the object inserted, along with the URL of the newly inserted object in the Location header of the response.
</td>
<td>
<pre>"Location"
</pre>
</td>
<td>
<pre><code>{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "phoneNumbers": {
      "type": "object",
      "properties": {
        "home": {
          "type": "string"
        },
        "work": {
          "type": "string"
        },
        "mobile": {
          "type": "string"
        }
      }
    }
  },
  "required": [
    "_id",
    "firstName"
  ],
  "additionalProperties": false
}
</code></pre>
</td>
</tr>
<tr>
<td>
400
</td>
<td>
Request is malformed (i.e. invalid parameters).
</td>
<td>
<pre>null
</pre>
</td>
<td>
<pre><code>{
  "type": "object",
  "properties": {
    "code": {
      "type": "integer"
    },
    "description": {
      "type": "string"
    },
    "message": {
      "type": "string"
    }
  },
  "required": [
    "code",
    "description",
    "message"
  ]
}
</code></pre>
</td>
</tr>
<tr>
<td>
403
</td>
<td>
User is not authorized to run this operation.
</td>
<td>
<pre>null
</pre>
</td>
<td>
<pre><code>{
  "type": "object",
  "properties": {
    "code": {
      "type": "integer"
    },
    "description": {
      "type": "string"
    },
    "message": {
      "type": "string"
    }
  },
  "required": [
    "code",
    "description",
    "message"
  ]
}
</code></pre>
</td>
</tr>
<tr>
<td>
500
</td>
<td>
There was an unexpected internal error processing this request.
</td>
<td>
<pre>null
</pre>
</td>
<td>
<pre><code>{
  "type": "object",
  "properties": {
    "code": {
      "type": "integer"
    },
    "description": {
      "type": "string"
    },
    "message": {
      "type": "string"
    }
  },
  "required": [
    "code",
    "description",
    "message"
  ]
}
</code></pre>
</td>
</tr>
</table>

[back to ToC](/api-docs/index.md)
