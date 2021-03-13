# Zifi-Online_Node_API
An e-Commere API build using **Express**, **NodeJs** and **MongoDB**

## 3rd Party libraries used:
- **joi**:   The most powerful schema description language and data validator for JavaScript
- **bcrypt**:   helps to hash passwords
- **config**:   organizes hierarchical configurations for your app deployments
- **lodash**:   utility library delivering consistency, modularity, performance, & extras
- **winston**:   designed to be a simple and universal logging library with support for multiple transports. A transport is essentially a storage device for logs
- **mongoose**:  object modeling tool designed to work in an asynchronous environment
- **jsonwebtoken**:   is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object
- **express-async-errors**:   A dead simple ES6 async/await support hack for ExpressJS



# Zifi-Online REST API Doc
At the begining of Route below, Domain should be included (Eg: www.SomeDomain.com)
Further more, for every route there might be CRUD operations some of them with Parameters in URL or Query String


## User
**Route:  /api/users**

#### GET /me
- To get Details of the one requesting for the details
- Should be Logged In

#### GET /all
- To get Details of all the User in DataBase
- User Should be Logged In and Admin

#### POST / 
- To Create a New User
- JSON object in Body of Request
  - name:      String, Min 5 characters, Max 50 characters, REQUIRED,
  - email:     String, Should be an E-mail, Min 5 characters, Max 255 characters, REQUIRED,
  - password:  String, Min 4 characters, Max 255 characters, REQUIRED,
  - isAdmin:   Boolean, OPTIONAL

#### DELETE /me
- To Delete the User Profile of requesting User Permanently
- Should be Logged In

#### DELETE /:id 
- To Delete User with given ID Permanently.
- User Should be Logged In and Admin


## Auth
**Route:  /api/auth**  
This Route is used to Log In to Zifi-Online

#### POST /
- JSON Object in Boddy of request
  - email:     String, Should be an E-mail, Min 5 characters, Max 255 characters, REQUIRED,
  - password:  String, Min 4 characters, Max 255 characters, REQUIRED,
- JsonWebToken (JWT) will be Returned if successfully Logged In







