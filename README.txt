Basic CRUD operations implementation

To run:
    * clone this repository
    * npm install
    * npm run dev

Implemented operations description and usage

1. post '/users' endpoint
example POST http://localhost:3000/users
{
	"login": "lsargsyan",
	"password": "asdfPass1",
	"age" : 8
}

User has the following configuration
User = {
    id: string // not allowed in body, generating automatically
    login: string // requered in request body
    password: string // requered in request body
    age: number // requered in request body
    isDeleted: boolean // not allowed in the body, false by dafault, sets true via soft delete (see bellow)
}

"login" value passes validation wheter there is no such user alredy
"password" value passes validation: must contain letters and numbers (must be alphanumeric)
"age" value passes validation: must be integer between 4 - 130

2. put 'users/:id' endpoint
example:
PUT http://localhost:3000/users/1
{
	"login": "updatedLogin",
	"password": "updatedPass",
	"age" : 4
}

passes validation of existence of user by given id

3. get '/users/:id' endpoint
example:
GET http://localhost:3000/users/1
no body

passes validation of existence of user by given id
Returns user details

4. get '/users' endpoint
example 1:
GET http://localhost:3000/users
no body

returns all users list

example 2:
GET http://localhost:3000/users?loginContains=sargsyan
no body

returns users list where users are sorted by login property, and filtered by loginContains query parameter (by implementing "getAutoSuggestUser" method)

5. delete 'users/:id' endpoint (soft delete)
example:
DELETE http://localhost:3000/users/1
no body

passes validation of existence of user by given id
performs soft delete operation on given user by setting "isDelted" property true. Keeps the user in the list

---------------------------------------------------------
All bodies passing JSON schema validation using "Joi" validator