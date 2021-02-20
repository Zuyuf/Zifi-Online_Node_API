const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { UserDetail } = require("../../../models/userDetail");

const _ = require("lodash");
const req = require("supertest");

let server;

//
//
describe("/api/auth", () => {
   //
   beforeEach(() => {
      server = require("../../../index");
   });

   afterEach(async () => {
      await User.remove();
      await server.close();
   });

   //
   //
   describe("GET /", () => {
      let token;
      let user_data;
      let user;
      let users;
      let users_details;

      beforeEach(async () => {
         user_data = {
            name: "abcdef",
            email: "abcdef@xyz.com",
            password: "12345",
            isAdmin: true,
         };

         user = new User(user_data);
         await user.save();

         token = user.generateAuthToken();

         users = [
            {
               _id: mongoose.Types.ObjectId().toHexString(),
               name: "MNOPQRS",
               email: "mnopqrs@xyz.com",
               password: "12345678",
               isAdmin: true,
            },
            {
               _id: mongoose.Types.ObjectId().toHexString(),
               name: "HIJKLMN",
               email: "hijklmn@xyz.com",
               password: "987654321",
               isAdmin: false,
            },
         ];

         users_details = [
            {
               _id: mongoose.Types.ObjectId().toHexString(),
               user_id: users[0]._id,
               firstName: "Zuyuf2",
               lastName: "Manna",
               addresses: [
                  {
                     name: "Home Address",
                     line1: "01234567890123",
                     line2: "01234567890123",
                     pincode: "X87BH112",
                  },
                  {
                     name: "Work Address",
                     line1: "01234567890123",
                     line2: "01234567890123",
                     pincode: "X87BH112",
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
            },
            {
               _id: mongoose.Types.ObjectId().toHexString(),
               user_id: users[1]._id,
               firstName: "Arsalan",
               lastName: "Bhaw",
               addresses: [
                  {
                     name: "Home Address",
                     line1: "01234567890123",
                     line2: "01234567890123",
                     pincode: "X87BH112",
                  },
                  {
                     name: "Work Address",
                     line1: "01234567890123",
                     line2: "01234567890123",
                     pincode: "X87BH112",
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
            },
         ];

         await User.collection.insertMany(users);
         await UserDetail.collection.insertMany(users_details);
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server).get("/api/userDetails").set("x-auth-token", token);
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

         //
         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return 200 if user is Admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return users details if user is Admin", async () => {
         const res = await exec();

         const userDetail = await UserDetail.find();

         expect(res.status).toBe(200);
         expect(res.body).toHaveLength(2);

         expect(res.body[0]).toMatchObject(users_details[0]);
      });
   });

   //
   //
   describe("GET /me", () => {
      let token;
      let user_data;
      let userDetails_data;
      let user;
      let userDetails;

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
               },
               {
                  name: "Work Address",
                  line1: "01234567890123",
                  line2: "01234567890123",
                  pincode: "X87BH112",
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

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .get(`/api/userDetails/me`)
            .set("x-auth-token", token);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 404 if user details with given user Id was Not Found", async () => {
         token = new User({
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: false,
         }).generateAuthToken();

         //
         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return users details if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toHaveLength(1);

         expect(res.body[0]).toMatchObject(userDetails_data);
      });
   });

   //
   //
   describe("POST /", () => {
      let token;
      let user_data;
      let userDetails_data;
      let user;

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
            firstName: "Zuyuf2",
            lastName: "Manna",
            addresses: [
               {
                  name: "Home Address",
                  line1: "01234567890123",
                  line2: "01234567890123",
                  pincode: "X87BH112",
               },
            ],
            homePhone: 123456789,
            workPhone: 123456789,
            cards: [
               {
                  name: "State Bank",
                  cardNumber: "ABC4h456",
               },
            ],
         };

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .post("/api/userDetails/")
            .set("x-auth-token", token)
            .send(userDetails_data);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      //
      it("should return 400 if firstName is not passed", async () => {
         userDetails_data = _.omit(userDetails_data, ["firstName"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if firstName is less then 5 character", async () => {
         userDetails_data.firstName = "ABCD";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if firstName is greater then 50 character", async () => {
         userDetails_data.firstName = new Array(52).join("A");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if lastName is not passed", async () => {
         userDetails_data = _.omit(userDetails_data, ["lastName"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if lastName is less then 5 character", async () => {
         userDetails_data.lastName = "ABCD";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if lastName is greater then 50 character", async () => {
         userDetails_data.lastName = new Array(52).join("A");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if homePhone is not passed", async () => {
         userDetails_data = _.omit(userDetails_data, ["homePhone"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if homePhone is less then 5 character", async () => {
         userDetails_data.homePhone = 1234;

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if homePhone is greater then 50 character", async () => {
         userDetails_data.homePhone = parseInt(new Array(22).join("1"));

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if workPhone is not passed", async () => {
         userDetails_data = _.omit(userDetails_data, ["workPhone"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if workPhone is less then 5 character", async () => {
         userDetails_data.workPhone = 1234;

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if workPhone is greater then 50 character", async () => {
         userDetails_data.workPhone = parseInt(new Array(22).join("1"));

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      //
      //
      it("should return 400 if addresses is not passed", async () => {
         userDetails_data = _.omit(userDetails_data, ["addresses"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      //
      //
      it("should return 400 if addresses[0].name is not passed", async () => {
         userDetails_data.addresses = _.omit(userDetails_data.addresses, [
            "name",
         ]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if addresses[0].name is lesser then 5 character", async () => {
         userDetails_data.addresses[0].name = "mnop";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if addresses[0].name is greater then 50 character", async () => {
         userDetails_data.addresses[0].name = new Array(52).join("m");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if addresses[0].line1 is not passed", async () => {
         userDetails_data.addresses = _.omit(userDetails_data.addresses, [
            "line1",
         ]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if addresses[0].line1 is lesser then 10 character", async () => {
         userDetails_data.addresses[0].line1 = "mnopqMNOP";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if addresses[0].line1 is greater then 100 character", async () => {
         userDetails_data.addresses[0].line1 = new Array(102).join("M");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if addresses[0].line2 is not passed", async () => {
         userDetails_data.addresses = _.omit(userDetails_data.addresses, [
            "line2",
         ]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if addresses[0].line2 is lesser then 10 character", async () => {
         userDetails_data.addresses[0].line2 = "mnopqMNOP";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if addresses[0].line2 is greater then 100 character", async () => {
         userDetails_data.addresses[0].line2 = new Array(102).join("M");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if addresses[0].pincode is not passed", async () => {
         userDetails_data.addresses = _.omit(userDetails_data.addresses, [
            "pincode",
         ]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if addresses[0].pincode is lesser then 4 character", async () => {
         userDetails_data.addresses[0].pincode = "mno";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if addresses[0].pincode is greater then 10 character", async () => {
         userDetails_data.addresses[0].pincode = new Array(12).join("M");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      //
      //
      it("should return 400 if cards is not passed", async () => {
         userDetails_data = _.omit(userDetails_data, ["cards"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      //
      //
      it("should return 400 if cards.name is not passed", async () => {
         userDetails_data.cards = _.omit(userDetails_data.cards, ["name"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if cards[0].name is lesser then 5 character", async () => {
         userDetails_data.cards[0].name = "code";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if cards[0].name is greater then 50 character", async () => {
         userDetails_data.cards[0].name = new Array(52).join("N");

         const res = await exec();

         expect(res.status).toBe(400);
      });
      //
      it("should return 400 if cards[0].cardNumber is not passed", async () => {
         userDetails_data.cards = _.omit(userDetails_data.cards, [
            "cardNumber",
         ]);

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if cards[0].cardNumber is lesser then 8 character", async () => {
         userDetails_data.cards[0].cardNumber = "pincode";

         const res = await exec();

         expect(res.status).toBe(400);
      });
      it("should return 400 if cards[0].cardNumber is greater then 30 character", async () => {
         userDetails_data.cards[0].cardNumber = new Array(32).join("C");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      //
      //
      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return users details if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(userDetails_data);
      });
   });

   //
   //
   describe("PUT /:id", () => {
      let id;
      let token;
      let user_data;
      let userDetails_data;
      let user;
      let userDetails;

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
               },
            ],
            homePhone: 123456789,
            workPhone: 123456789,
            cards: [
               {
                  name: "State Bank",
                  cardNumber: "ABC4h456",
               },
            ],
         };

         userDetails = new UserDetail(userDetails_data);
         await userDetails.save();

         token = user.generateAuthToken();
         id = userDetails._id.toHexString();

         userDetails_data = _.omit(userDetails_data, ["user_id"]);
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .put(`/api/userDetails/${id}`)
            .set("x-auth-token", token)
            .send(userDetails_data);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      //
      it("should return 404 if given Id is not a valid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 404 if given Id was Not Found!", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return updated user details if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(userDetails_data);
      });
   });

   //
   //
   describe("DELETE /:id", () => {
      let id;
      let token;
      let user_data;
      let userDetails_data;
      let user;
      let userDetails;

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
               },
            ],
            homePhone: 123456789,
            workPhone: 123456789,
            cards: [
               {
                  name: "State Bank",
                  cardNumber: "ABC4h456",
               },
            ],
         };

         userDetails = new UserDetail(userDetails_data);
         await userDetails.save();

         token = user.generateAuthToken();
         id = userDetails._id.toHexString();

         userDetails_data = _.omit(userDetails_data, ["user_id"]);
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .delete(`/api/userDetails/${id}`)
            .set("x-auth-token", token);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      //
      it("should return 404 if given Id is not a valid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 404 if given Id was Not Found!", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return deleted user details if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(userDetails_data);
      });
   });
   //
});
