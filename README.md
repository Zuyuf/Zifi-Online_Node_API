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


## User API
> **Route:  /api/users**  
> This API will be useed to Create, Read, Update and Delete User  
>
> #### GET /me
> - To get Details of the one requesting for the details
> - Should be Logged In
>
> #### GET /
> - To get Details of all the User in DataBase
> - User Should be Logged In and Admin
> 
> #### POST / 
> - To Create a New User
> - JSON object in Body of Request
>   - **_name_**:      String, Min 5 characters, Max 50 characters, REQUIRED,
>   - **_email_**:     String, Should be an E-mail, Min 5 characters, Max 255 characters, REQUIRED,
>   - **_password_**:  String, Min 4 characters, Max 255 characters, REQUIRED,
>   - **_isAdmin_**:   Boolean, OPTIONAL
> 
> #### DELETE /me
> - To Delete the User Profile of requesting User Permanently
> - Should be Logged In
> 
> #### DELETE /:id 
> - To Delete User with given ID Permanently.
> - User Should be Logged In and Admin


## Auth API
> **Route:  /api/auth**  
> This Route is used to Log In to Zifi-Online, which in return sends JWT(JsonWebToken) if Successfully Logged In
> 
> #### POST /
> - JSON Object in Body of request
>   - **_email_**:     String, Should be an E-mail, Min 5 characters, Max 255 characters, REQUIRED,
>   - **_password_**:  String, Min 4 characters, Max 255 characters, REQUIRED,
> - JsonWebToken (JWT) will be Returned if successfully Logged In


## User Details API
> **Route:  /api/userDetails**  
> This Route is used to Access Details of User
> 
> #### GET /
> - To get all User Details
> - User Should be Logged In and Admin
> 
> #### GET /me
> - To get Details of Requesting User
> - User Should be Logged In
> 
> #### POST /
> - To Create User Details of the Requesting User
> - User Should be Logged In
> 
> #### PUT /
> - To Update User Details of the Requesting User
> - User Should be Logged In
> 
> #### DELETE /
>-  To Delete User Details of the Requesting User
> - User Should be Logged In
 

## User Details Addresses API
> **Route:  /api/userDetails/addresses**  
> This Route is used to handle Addresses of User requesting the Service
> 
> #### GET /me
> - To get all the Addresses the requesting user has created
> - User Should be Logged In
> 
> #### GET /:id
> - To get specific Addresse with given ID of Address, the requesting user has created
> - User Should be Logged In
> 
> #### POST /
> - To Create Address for the requesting user
> - User Should be Logged In
> - JSON Object in Boddy of request
>   - **_name_**:         String, Minimum 5 character, Maximum 50 character, REQUIRED
>   - **_line1_**:        String, Minimum 10 character, Maximum 100 character, REQUIRED
>   - **_line2_**:        String, Minimum 10 character, Maximum 100 character, REQUIRED
>   - **_pincode_**:      String, Minimum 4 character, Maximum 10 character, REQUIRED
>   - **_phoneNumber_**:  Number, Minimum 5 digits, Maximum 20 digit, REQUIRED
>   - **_landMark_**:     String, Minimum 5 character, Maximum 50 character, REQUIRED
> 
> #### PUT /:id
> - To Update Address with given ID for the requesting user
> - User Should be Logged In
> - JSON Object in Body of request
>   - **_name_**:         String, Minimum 5 character, Maximum 50 character, REQUIRED
>   - **_line1_**:        String, Minimum 10 character, Maximum 100 character, REQUIRED
>   - **_line2_**:        String, Minimum 10 character, Maximum 100 character, REQUIRED
>   - **_pincode_**:      String, Minimum 4 character, Maximum 10 character, REQUIRED
>   - **_phoneNumber_**:  Number, Minimum 5 digits, Maximum 20 digit, REQUIRED
>   - **_landMark_**:     String, Minimum 5 character, Maximum 50 character, REQUIRED
> 
> #### DELETE /:id
> - To Delete Address with given ID for the requesting user
> - User Should be Logged In


## User Details Cards API
> **Route:  /api/userDetails/cards**  
> This Route is used to handle Cards of User requesting the Service
> 
> #### GET /me
> - To get all the Cards the requesting user has created
> - User Should be Logged In
> 
> #### GET /:id
> - To get specific Card with given ID of Card, the requesting user has created
> - User Should be Logged In
> 
> #### POST /
> - To Create Card for the requesting user
> - User Should be Logged In
> - JSON Object in Body of request
>   - **_name_**:       String, Minimum 5 character, Maximum 50 character, REQUIRED
>   - **_cardNumber_**: String, Minimum 8 character, Maximum 30 character, REQUIRED
> 
> #### PUT /:id
> - To Update Card with given ID for the requesting user
> - User Should be Logged In
> - JSON Object in Body of request
>   - **_name_**:       String, Minimum 5 character, Maximum 50 character, REQUIRED
>   - **_cardNumber_**: String, Minimum 8 character, Maximum 30 character, REQUIRED
> 
> #### DELETE /:id
> - To Delete Card with given ID for the requesting user
> - User Should be Logged In


## Categories API
> **Route:  /api/categories**
> This API will be used to manage Product CAtegories
> 
> #### GET/
> - To get all the categories from DataBase
> 
> #### GET /:id
> - To get the category with given ID from DataBase
> 
> #### POST /
> - To Create a new Category 
> - User Should be Logged In and Admin
> - JSON Object in Body of request
>   - **_name_**:       String, Minimum 5 character, Maximum 50 character, REQUIRED
> 
> #### PUT /:id
> - To Update a Category with given ID from DataBase
> - User Should be Logged In and Admin
> - JSON Object in Body of request
>   - **_name_**:       String, Minimum 5 character, Maximum 50 character, REQUIRED
> 
> #### DELETE /:id
> - To Delete a Category with given ID from DataBase
> - User Should be Logged In and Admin


## Products API
> **Route:  /api/products**
> this APi will be used to MAanage the Products
> 
> #### GET/
> - To get all the Products from DataBase
> 
> #### GET /:id
> - To get the Product with given ID from DataBase
> 
> #### POST /
> - To Create a new Product 
> - User Should be Logged In and Admin
> - JSON Object in Body of request
>   - **_category_id_**:    ID of category, REQUIRED
>   - **_name_**:           String, Minimum 5 character, Maximum 255 character, REQUIRED
>   - **_price_**:          Number, Integer, Minimum 0, REQUIRED
>   - **_description_**:    String, Minimum 5 character, Maximum 2048 character, REQUIRED
>   - **_productDetails_**: Array, Minimum 1 item, Maximum 10 items
>     - **_propGroupName_**:   String, Minimum 3 character, Maximum 50 character, REQUIRED
>     - **_props_**:           Array, Minimum 1 item, Maximum 25 items
>       - **_propName_**:           String, Minimum 3 character, Maximum 50 character, REQUIRED
>       - **_propValue_**:          String, Minimum 3 character, Maximum 255 character, REQUIRED
> 
> #### PUT /:id
> - To Update a Product with given ID from DataBase
> - User Should be Logged In and Admin
> - JSON Object in Body of request
>   - **_category_id_**:    ID of category, REQUIRED
>   - **_name_**:           String, Minimum 5 character, Maximum 255 character, REQUIRED
>   - **_price_**:          Number, Integer, Minimum 0, REQUIRED
>   - **_description_**:    String, Minimum 5 character, Maximum 2048 character, REQUIRED
>   - **_productDetails_**: Array, Minimum 1 item, Maximum 10 items
>     - **_propGroupName_**:   String, Minimum 3 character, Maximum 50 character, REQUIRED
>     - **_props_**:           Array, Minimum 1 item, Maximum 25 items
>       - **_propName_**:           String, Minimum 3 character, Maximum 50 character, REQUIRED
>       - **_propValue_**:          String, Minimum 3 character, Maximum 255 character, REQUIRED
> 
> #### DELETE /:id
> - To Delete a Product with given ID from DataBase
> - User Should be Logged In and Admin


## Order API
> **Route:  /api/orders**
> Use this APi to Read and Create Orders
> 
> #### GET/
> - To get all the Orders from DataBase
> 
> #### GET /:id
> - To get the Order with given ID from DataBase
> 
> #### POST /
> - To Create a new Order 
> - User Should be Logged In and Admin
> - JSON Object in Body of request
>   - **_address_id_**:    ID of category, REQUIRED
>   - **_products_**: Array, Minimum 1 item
>     - **_productId_**:    ID of category, REQUIRED
>     - **_quantity_**:     Number, Integer, Minimum 1, REQUIRED




