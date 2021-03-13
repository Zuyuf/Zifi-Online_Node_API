const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { UserDetail } = require("../../../models/userDetail");
const { Product } = require("../../../models/product");
const { Order } = require("../../../models/order");

const _ = require("lodash");
const req = require("supertest");

let server;

//
//
describe("/api/orders", () => {
   //
   beforeEach(() => {
      server = require("../../../index");
   });

   afterEach(async () => {
      await User.remove();
      await UserDetail.remove();
      await Product.remove();
      await Order.remove();

      await server.close();
   });

   //
   //

   describe("GET /me", () => {
      let token;
      let user_data;
      let user;
      let order_data;

      beforeEach(async () => {
         user_data = {
            name: "abcdef",
            email: "abcdef@xyz.com",
            password: "12345",
            isAdmin: true,
         };

         user = new User(user_data);
         await user.save();

         order_data = [
            {
               user_id: user._id,
               products: [
                  {
                     productName: "Samsung S10",
                     price: 35000,
                     quantity: 1,
                     subTotal: 35000,
                  },
                  {
                     productName: "OnePlus 8 Pro",
                     price: 30000,
                     quantity: 2,
                     subTotal: 60000,
                  },
               ],
               deliveryDetails: {
                  name: "Home Address",
                  line1: "01234567890123",
                  line2: "01234567890123",
                  pincode: "X87BH112",
                  phoneNumber: 123456789,
                  landMark: "land Mark...",
               },
               gradTotal: 95000,
            },
            {
               user_id: user._id,
               products: [
                  {
                     productName: "Me T-shirt",
                     price: 500,
                     quantity: 3,
                     subTotal: 1500,
                  },
                  {
                     productName: "Jeans",
                     price: 800,
                     quantity: 5,
                     subTotal: 4000,
                  },
               ],
               deliveryDetails: {
                  name: "Work Address",
                  line1: "9999999567890123",
                  line2: "8888888887890123",
                  pincode: "GGGG7BH112",
                  phoneNumber: 7777666689,
                  landMark: "land Mark...",
               },
               gradTotal: 5500,
            },
         ];

         await Order.collection.insertMany(order_data);

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
         await Order.remove();
      });

      const exec = () => {
         return req(server).get("/api/orders/me").set("x-auth-token", token);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 200 if user is not logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return orders", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toHaveLength(2);

         expect(res.body[0]).toHaveProperty(
            "user_id",
            order_data[0].user_id.toString()
         );
         expect(res.body[0].products[0]).toHaveProperty(
            "productName",
            order_data[0].products[0].productName
         );
         expect(res.body[0].products[1]).toHaveProperty(
            "price",
            order_data[0].products[1].price
         );
         expect(res.body[0].products[1]).toHaveProperty(
            "subTotal",
            order_data[0].products[1].subTotal
         );
         expect(res.body[0].deliveryDetails).toHaveProperty(
            "pincode",
            order_data[0].deliveryDetails.pincode
         );
         expect(res.body[0]).toHaveProperty(
            "gradTotal",
            order_data[0].gradTotal
         );

         expect(res.body[1]).toHaveProperty(
            "user_id",
            order_data[1].user_id.toString()
         );
         expect(res.body[1].products[0]).toHaveProperty(
            "productName",
            order_data[1].products[0].productName
         );
         expect(res.body[1].products[1]).toHaveProperty(
            "price",
            order_data[1].products[1].price
         );
         expect(res.body[1].products[1]).toHaveProperty(
            "subTotal",
            order_data[1].products[1].subTotal
         );
         expect(res.body[1].deliveryDetails).toHaveProperty(
            "pincode",
            order_data[1].deliveryDetails.pincode
         );
         expect(res.body[1]).toHaveProperty(
            "gradTotal",
            order_data[1].gradTotal
         );
      });
   });

   //

   describe("GET /:id", () => {
      let id;
      let token;
      let user_data;
      let user;
      let order_data;
      let order;

      beforeEach(async () => {
         user_data = {
            name: "abcdef",
            email: "abcdef@xyz.com",
            password: "12345",
            isAdmin: true,
         };

         user = new User(user_data);
         await user.save();

         order_data = {
            user_id: user._id,
            products: [
               {
                  productId: mongoose.Types.ObjectId().toHexString(),
                  productName: "Samsung S10",
                  price: 35000,
                  quantity: 1,
                  subTotal: 35000,
               },
            ],
            deliveryDetails: {
               name: "Home Address",
               line1: "01234567890123",
               line2: "01234567890123",
               pincode: "X87BH112",
               phoneNumber: 123456789,
               landMark: "land Mark...",
            },
            gradTotal: 95000,
         };

         order = new Order(order_data);
         await order.save();

         token = user.generateAuthToken();
         id = order._id;
      });

      afterEach(async () => {
         await User.remove();
         await Order.remove();
      });

      const exec = () => {
         return req(server).get(`/api/orders/${id}`).set("x-auth-token", token);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      //
      it("should return 404 if order Id is invalid", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 404 if order with given Id was Not Found", async () => {
         id = mongoose.Types.ObjectId.toString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 200 if user is not logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return orders", async () => {
         const res = await exec();

         expect(res.status).toBe(200);

         expect(res.body).toHaveProperty(
            "user_id",
            order_data.user_id.toString()
         );
         expect(res.body.products[0]).toHaveProperty(
            "productName",
            order_data.products[0].productName
         );
         expect(res.body.products[0]).toHaveProperty(
            "price",
            order_data.products[0].price
         );
         expect(res.body.products[0]).toHaveProperty(
            "subTotal",
            order_data.products[0].subTotal
         );
         expect(res.body.deliveryDetails).toHaveProperty(
            "pincode",
            order_data.deliveryDetails.pincode
         );
         expect(res.body).toHaveProperty("gradTotal", order_data.gradTotal);
      });
   });

   //

   describe("POST /", () => {
      let token;

      let user;
      let user_data;

      let userDetails;
      let userDetails_data;

      let product_data;
      let product1;
      let product2;

      let order_data;

      beforeEach(async () => {
         user_data = {
            name: "abcdef",
            email: "abcdef@xyz.com",
            password: "12345",
            isAdmin: true,
         };

         user = new User(user_data);
         await user.save();

         userDetails_data = {
            user_id: user._id.toHexString(),
            firstName: "Zuyuf2",
            lastName: "Manna",
            addresses: [
               {
                  name: "Home Address",
                  line1: "01234567890123",
                  line2: "01234567890123",
                  pincode: "X87BH112",
                  phoneNumber: 123456789,
                  landMark: "land Mark...",
               },
               {
                  name: "Work Address",
                  line1: "01234567890123",
                  line2: "01234567890123",
                  pincode: "X87BH112",
                  phoneNumber: 123456789,
                  landMark: "land Mark...",
               },
            ],
            homePhone: 123456789,
            workPhone: 123456789,
            cards: [
               {
                  name: "State Bank",
                  cardNumber: "ABC4h456",
               },
               {
                  name: "Union Bank",
                  cardNumber: "ABC4h456",
               },
            ],
         };

         userDetails = new UserDetail(userDetails_data);
         await userDetails.save();

         user.userDetails = userDetails._id;
         await user.save();

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
               price: 35000,
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

         product1 = new Product(product_data[0]);
         await product1.save();

         product2 = new Product(product_data[1]);
         await product2.save();

         order_data = {
            address_id: userDetails.addresses[0]._id,
            products: [
               {
                  productId: product1._id,
                  quantity: 1,
               },
               {
                  productId: product2._id,
                  quantity: 2,
               },
            ],
         };

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
         await Product.remove();
         await Order.remove();
      });

      const exec = () => {
         return req(server)
            .post(`/api/orders/`)
            .set("x-auth-token", token)
            .send(order_data);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 200 if user is logged in", async () => {
         console.log(
            `>>>>    POST Test Return 200:  START:  ${product1._id} -- ${product2._id} `
         );
         const res = await exec();
         console.log(">>>>    POST Test Return 200:  res.body:  ", res.body);

         expect(res.status).toBe(200);
      });

      it("should return Order", async () => {
         const res = await exec();
         const findOrder = await Order.findById(res.body._id);

         expect(res.status).toBe(200);

         expect(findOrder).not.toBeNull();

         expect(res.body).toHaveProperty("_id", findOrder._id.toString());

         expect(res.body).toHaveProperty(
            "user_id",
            findOrder.user_id.toString()
         );

         expect(res.body.products[0]).toHaveProperty(
            "productName",
            findOrder.products[0].productName
         );

         expect(res.body.products[0]).toHaveProperty(
            "price",
            findOrder.products[0].price
         );
         expect(res.body.products[0]).toHaveProperty(
            "subTotal",
            findOrder.products[0].subTotal
         );

         expect(res.body.deliveryDetails).toHaveProperty(
            "pincode",
            findOrder.deliveryDetails.pincode
         );

         expect(res.body).toHaveProperty("gradTotal", findOrder.gradTotal);
      });
   });
});
