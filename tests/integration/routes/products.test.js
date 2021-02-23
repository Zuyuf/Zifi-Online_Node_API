const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { UserDetail } = require("../../../models/userDetail");
const { Product } = require("../../../models/product");

const _ = require("lodash");
const req = require("supertest");

let server;

//
//
describe("/api/products", () => {
   //
   beforeEach(() => {
      server = require("../../../index");
   });

   afterEach(async () => {
      await User.remove();
      await UserDetail.remove();
      await Product.remove();
      await server.close();
   });

   //
   //

   describe("GET /", () => {
      let product_data;

      beforeEach(async () => {
         product_data = [
            {
               _id: mongoose.Types.ObjectId().toHexString(),
               category_id: mongoose.Types.ObjectId().toHexString(),
               name: "Samsung S10",
               price: 40000,
               description: "Samsung Galaxy S10 is one of the best phones",
               productDetails: [
                  {
                     propGroupName: "General",
                     props: [
                        {
                           propName: "Released on",
                           propValue: "2019",
                        },
                        {
                           propName: "Something",
                           propValue: "value",
                        },
                     ],
                  },
                  {
                     propGroupName: "Specs",
                     props: [
                        {
                           propName: "Chipset",
                           propValue: "SnapDragon 865",
                        },
                        {
                           propName: "Screen Resolution",
                           propValue: "1440p",
                        },
                        {
                           propName: "RAM",
                           propValue: "8 GB",
                        },
                        {
                           propName: "Storage",
                           propValue: "128 GB",
                        },
                     ],
                  },
               ],
            },
            {
               _id: mongoose.Types.ObjectId().toHexString(),
               category_id: mongoose.Types.ObjectId().toHexString(),
               name: "OnePlus 8",
               price: 37000,
               description: "OnePlus 8 is one of the best phones",
               productDetails: [
                  {
                     propGroupName: "General",
                     props: [
                        {
                           propName: "Released on",
                           propValue: "2018",
                        },
                        {
                           propName: "Something",
                           propValue: "value",
                        },
                     ],
                  },
                  {
                     propGroupName: "Specs",
                     props: [
                        {
                           propName: "Chipset",
                           propValue: "SnapDragon 865+",
                        },
                        {
                           propName: "Screen Resolution",
                           propValue: "1440p",
                        },
                        {
                           propName: "RAM",
                           propValue: "12 GB",
                        },
                        {
                           propName: "Storage",
                           propValue: "256 GB",
                        },
                     ],
                  },
               ],
            },
         ];

         await Product.collection.insertMany(product_data);
      });

      afterEach(async () => {
         await Product.remove();
      });

      const exec = () => {
         return req(server).get("/api/products");
      };

      //

      it("should return 200 (Login not required)", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return products", async () => {
         const res = await exec();

         const prods = await Product.find();

         expect(res.status).toBe(200);
         expect(res.body).toHaveLength(2);
         expect(res.body).toMatchObject(product_data);
      });
   });

   //
   //
   describe("GET /:id", () => {
      let id;
      let product_data;
      let product;

      beforeEach(async () => {
         product_data = [
            {
               category_id: mongoose.Types.ObjectId().toHexString(),
               name: "Samsung S10",
               price: 40000,
               description: "Samsung Galaxy S10 is one of the best phones",
               productDetails: [
                  {
                     propGroupName: "General",
                     props: [
                        {
                           propName: "Released on",
                           propValue: "2019",
                        },
                        {
                           propName: "Something",
                           propValue: "value",
                        },
                     ],
                  },
                  {
                     propGroupName: "Specs",
                     props: [
                        {
                           propName: "Chipset",
                           propValue: "SnapDragon 865",
                        },
                        {
                           propName: "Screen Resolution",
                           propValue: "1440p",
                        },
                        {
                           propName: "RAM",
                           propValue: "8 GB",
                        },
                        {
                           propName: "Storage",
                           propValue: "128 GB",
                        },
                     ],
                  },
               ],
            },
            {
               category_id: mongoose.Types.ObjectId().toHexString(),
               name: "OnePlus 8",
               price: 37000,
               description: "OnePlus 8 is one of the best phones",
               productDetails: [
                  {
                     propGroupName: "General",
                     props: [
                        {
                           propName: "Released on",
                           propValue: "2018",
                        },
                        {
                           propName: "Something",
                           propValue: "value",
                        },
                     ],
                  },
                  {
                     propGroupName: "Specs",
                     props: [
                        {
                           propName: "Chipset",
                           propValue: "SnapDragon 865+",
                        },
                        {
                           propName: "Screen Resolution",
                           propValue: "1440p",
                        },
                        {
                           propName: "RAM",
                           propValue: "12 GB",
                        },
                        {
                           propName: "Storage",
                           propValue: "256 GB",
                        },
                     ],
                  },
               ],
            },
         ];

         product = new Product(product_data[0]);
         product.save();

         id = product._id;
      });

      afterEach(async () => {
         await Product.remove();
      });

      const exec = () => {
         return req(server).get(`/api/products/${id}`);
      };

      //
      it("should return 404 if Id is invalid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 404 if product with given Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return prodcuts if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(product_data[0]);
      });
   });

   //
   //
   describe("POST /", () => {
      let token;
      let user;
      let user_data;
      let product_data;

      beforeEach(async () => {
         user_data = {
            name: "abcdef",
            email: "abcdef@xyz.com",
            password: "12345",
            isAdmin: true,
         };

         user = new User(user_data);
         await user.save();

         product_data = {
            category_id: mongoose.Types.ObjectId().toHexString(),
            name: "Samsung S10",
            price: 40000,
            description: "Samsung Galaxy S10 is one of the best phones",
            productDetails: [
               {
                  propGroupName: "General",
                  props: [
                     {
                        propName: "Released on",
                        propValue: "2019",
                     },
                     {
                        propName: "Something",
                        propValue: "value",
                     },
                  ],
               },
               {
                  propGroupName: "Specs",
                  props: [
                     {
                        propName: "Chipset",
                        propValue: "SnapDragon 865",
                     },
                     {
                        propName: "Screen Resolution",
                        propValue: "1440p",
                     },
                     {
                        propName: "RAM",
                        propValue: "8 GB",
                     },
                     {
                        propName: "Storage",
                        propValue: "128 GB",
                     },
                  ],
               },
            ],
         };

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
         await Product.remove();
      });

      const exec = () => {
         return req(server)
            .post("/api/products/")
            .set("x-auth-token", token)
            .send(product_data);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if user is not Admin", async () => {
         await User.remove();
         user_data.isAdmin = false;
         user = new User(user_data);
         await user.save();

         token = user.generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      //
      //
      it("should return 400 if category_id is not passed", async () => {
         product_data = _.omit(product_data, ["category_id"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if category_id is invalid", async () => {
         product_data.category_id = "1";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if name is not passed", async () => {
         product_data = _.omit(product_data, ["name"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if name is less then 5 character", async () => {
         product_data.name = "ABCD";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if name is greater then 255 character", async () => {
         product_data.name = new Array(257).join("A");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if price is not passed", async () => {
         product_data = _.omit(product_data, ["price"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if price is less then 0 character", async () => {
         product_data.price = -1;

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if description is not passed", async () => {
         product_data = _.omit(product_data, ["description"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if description is less then 5 character", async () => {
         product_data.description = "ABCD";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if description is greater then 2048 character", async () => {
         product_data.description = new Array(2050).join("A");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      //
      it("should return 200 if productDetails is not passed", async () => {
         product_data = _.omit(product_data, ["productDetails"]);

         const res = await exec();

         expect(res.status).toBe(200);
      });
      //
      it("should return 400 if productDetails is passed as [] array", async () => {
         product_data.productDetails = [];

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      //
      it("should return 400 if productDetails[0].propGroupName is not passed", async () => {
         product_data.productDetails[0] = _.omit(
            product_data.productDetails[0],
            ["propGroupName"]
         );

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if productDetails[0].propGroupName is lesser then 3 character", async () => {
         product_data.productDetails[0].propGroupName = "mn";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if productDetails[0].propGroupName is greater then 50 character", async () => {
         product_data.productDetails[0].propGroupName = new Array(52).join("m");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 200 if productDetails[0].props is not passed", async () => {
         product_data.productDetails[0] = _.omit(
            product_data.productDetails[0],
            ["props"]
         );

         const res = await exec();

         expect(res.status).toBe(200);
      });
      it("should return 400 if productDetails[0].props is passed as [] array", async () => {
         product_data.productDetails[0].props = [];

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      //
      it("should return 400 if productDetails[0].props[0].propName is not passed", async () => {
         product_data.productDetails[0].props[0] = _.omit(
            product_data.productDetails[0].props[0],
            ["propName"]
         );

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if productDetails[0].props[0].propName is lesser then 3 character", async () => {
         product_data.productDetails[0].props[0].propName = "mn";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if productDetails[0].props[0].propName is greater then 50 character", async () => {
         product_data.productDetails[0].props[0].propName = new Array(52).join(
            "m"
         );

         const res = await exec();

         expect(res.status).toBe(400);
      });
      //
      it("should return 400 if productDetails[0].props[0].propValue is not passed", async () => {
         product_data.productDetails[0].props[0] = _.omit(
            product_data.productDetails[0].props[0],
            ["propValue"]
         );

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if productDetails[0].props[0].propValue is lesser then 3 character", async () => {
         product_data.productDetails[0].props[0].propValue = "mn";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if productDetails[0].props[0].propValue is greater then 255 character", async () => {
         product_data.productDetails[0].props[0].propValue = new Array(
            257
         ).join("m");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      //
      it("should return 200 if user is Admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return product if user is Admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);

         expect(res.body).toHaveProperty(
            "category_id",
            product_data.category_id
         );
         expect(res.body).toHaveProperty(
            "description",
            "Samsung Galaxy S10 is one of the best phones"
         );
         expect(res.body).toHaveProperty("name", "Samsung S10");
         expect(res.body).toHaveProperty("price", 40000);

         expect(res.body.productDetails[0]).toHaveProperty(
            "propGroupName",
            "General"
         );
         expect(res.body.productDetails[0].props[0]).toHaveProperty(
            "propName",
            "Released on"
         );
         expect(res.body.productDetails[0].props[1]).toHaveProperty(
            "propValue",
            "value"
         );

         expect(res.body.productDetails[1]).toHaveProperty(
            "propGroupName",
            "Specs"
         );
         expect(res.body.productDetails[1].props[0]).toHaveProperty(
            "propValue",
            "SnapDragon 865"
         );
         expect(res.body.productDetails[1].props[1]).toHaveProperty(
            "propValue",
            "1440p"
         );
         expect(res.body.productDetails[1].props[2]).toHaveProperty(
            "propName",
            "RAM"
         );
      });
   });

   //
   //
   describe("PUT /", () => {
      let id;
      let token;
      let user;
      let user_data;
      let product;
      let product_data;
      let update_product_data;

      beforeEach(async () => {
         user_data = {
            name: "abcdef",
            email: "abcdef@xyz.com",
            password: "12345",
            isAdmin: true,
         };

         user = new User(user_data);
         await user.save();

         product_data = {
            category_id: mongoose.Types.ObjectId().toHexString(),
            name: "Samsung S10",
            price: 40000,
            description: "Samsung Galaxy S10 is one of the best phones",
            productDetails: [
               {
                  propGroupName: "General",
                  props: [
                     {
                        propName: "Released on",
                        propValue: "2019",
                     },
                     {
                        propName: "Something",
                        propValue: "value",
                     },
                  ],
               },
               {
                  propGroupName: "Specs",
                  props: [
                     {
                        propName: "Chipset",
                        propValue: "SnapDragon 865",
                     },
                     {
                        propName: "Screen Resolution",
                        propValue: "1440p",
                     },
                     {
                        propName: "RAM",
                        propValue: "8 GB",
                     },
                     {
                        propName: "Storage",
                        propValue: "128 GB",
                     },
                  ],
               },
            ],
         };

         update_product_data = {
            category_id: product_data.category_id,
            name: "UPDATED Samsung S10",
            price: 40000,
            description: "UPDATED Samsung Galaxy S10 is one of the best phones",
            productDetails: [
               {
                  propGroupName: "UPDATED General",
                  props: [
                     {
                        propName: "UPDATED Released on",
                        propValue: "UPDATED 2019",
                     },
                     {
                        propName: "UPDATED Something",
                        propValue: "UPDATED value",
                     },
                  ],
               },
               {
                  propGroupName: "UPDATED Specs",
                  props: [
                     {
                        propName: "UPDATED Chipset",
                        propValue: "UPDATED SnapDragon 865",
                     },
                     {
                        propName: "UPDATED Screen Resolution",
                        propValue: "UPDATED 1440p",
                     },
                     {
                        propName: "UPDATED RAM",
                        propValue: "UPDATED 8 GB",
                     },
                     {
                        propName: "UPDATED Storage",
                        propValue: "UPDATED 128 GB",
                     },
                  ],
               },
            ],
         };

         product = new Product(product_data);
         await product.save();

         token = user.generateAuthToken();
         id = product._id;
      });

      afterEach(async () => {
         await User.remove();
         await Product.remove();
      });

      const exec = () => {
         return req(server)
            .put(`/api/products/${id}`)
            .set("x-auth-token", token)
            .send(update_product_data);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if user is not Admin", async () => {
         await User.remove();
         user_data.isAdmin = false;
         user = new User(user_data);
         await user.save();

         token = user.generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return 404 if Id is invalid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      // validated Product props in POST

      it("should return 404 if product with given Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 200 if user is Admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return product if user is Admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);

         expect(res.body).toHaveProperty(
            "category_id",
            product_data.category_id
         );
         expect(res.body).toHaveProperty(
            "description",
            "UPDATED Samsung Galaxy S10 is one of the best phones"
         );
         expect(res.body).toHaveProperty("name", "UPDATED Samsung S10");
         expect(res.body).toHaveProperty("price", 40000);

         expect(res.body.productDetails[0]).toHaveProperty(
            "propGroupName",
            "UPDATED General"
         );
         expect(res.body.productDetails[0].props[0]).toHaveProperty(
            "propName",
            "UPDATED Released on"
         );
         expect(res.body.productDetails[0].props[1]).toHaveProperty(
            "propValue",
            "UPDATED value"
         );

         expect(res.body.productDetails[1]).toHaveProperty(
            "propGroupName",
            "UPDATED Specs"
         );
         expect(res.body.productDetails[1].props[0]).toHaveProperty(
            "propValue",
            "UPDATED SnapDragon 865"
         );
         expect(res.body.productDetails[1].props[1]).toHaveProperty(
            "propValue",
            "UPDATED 1440p"
         );
         expect(res.body.productDetails[1].props[2]).toHaveProperty(
            "propName",
            "UPDATED RAM"
         );
      });
   });

   //
   //
   describe("DELETE /:id", () => {
      let id;
      let token;
      let user;
      let user_data;
      let product;
      let product_data;

      beforeEach(async () => {
         user_data = {
            name: "abcdef",
            email: "abcdef@xyz.com",
            password: "12345",
            isAdmin: true,
         };

         user = new User(user_data);
         await user.save();

         product_data = {
            category_id: mongoose.Types.ObjectId().toHexString(),
            name: "Samsung S10",
            price: 40000,
            description: "Samsung Galaxy S10 is one of the best phones",
            productDetails: [
               {
                  propGroupName: "General",
                  props: [
                     {
                        propName: "Released on",
                        propValue: "2019",
                     },
                     {
                        propName: "Something",
                        propValue: "value",
                     },
                  ],
               },
               {
                  propGroupName: "Specs",
                  props: [
                     {
                        propName: "Chipset",
                        propValue: "SnapDragon 865",
                     },
                     {
                        propName: "Screen Resolution",
                        propValue: "1440p",
                     },
                     {
                        propName: "RAM",
                        propValue: "8 GB",
                     },
                     {
                        propName: "Storage",
                        propValue: "128 GB",
                     },
                  ],
               },
            ],
         };

         product = new Product(product_data);
         await product.save();

         token = user.generateAuthToken();
         id = product._id;
      });

      afterEach(async () => {
         await User.remove();
         await Product.remove();
      });

      const exec = () => {
         return req(server)
            .delete(`/api/products/${id}`)
            .set("x-auth-token", token);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if user is not Admin", async () => {
         await User.remove();
         user_data.isAdmin = false;
         user = new User(user_data);
         await user.save();

         token = user.generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return 404 if Id is invalid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      // validated Product props in POST

      it("should return 404 if product with given Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();
         console.log(
            ">>>>    return 404 if product with given Id was Not Found:  res.body:  ",
            res.body
         );

         expect(res.status).toBe(404);
      });

      //
      it("should return 200 if user is Admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return product if user is Admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);

         expect(res.body).toHaveProperty(
            "category_id",
            product_data.category_id
         );
         expect(res.body).toHaveProperty(
            "description",
            "Samsung Galaxy S10 is one of the best phones"
         );
         expect(res.body).toHaveProperty("name", "Samsung S10");
         expect(res.body).toHaveProperty("price", 40000);

         expect(res.body.productDetails[0]).toHaveProperty(
            "propGroupName",
            "General"
         );
         expect(res.body.productDetails[0].props[0]).toHaveProperty(
            "propName",
            "Released on"
         );
         expect(res.body.productDetails[0].props[1]).toHaveProperty(
            "propValue",
            "value"
         );

         expect(res.body.productDetails[1]).toHaveProperty(
            "propGroupName",
            "Specs"
         );
         expect(res.body.productDetails[1].props[0]).toHaveProperty(
            "propValue",
            "SnapDragon 865"
         );
         expect(res.body.productDetails[1].props[1]).toHaveProperty(
            "propValue",
            "1440p"
         );
         expect(res.body.productDetails[1].props[2]).toHaveProperty(
            "propName",
            "RAM"
         );
      });
   });
});
