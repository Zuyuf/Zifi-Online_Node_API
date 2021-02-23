const mongoose = require("mongoose");
const { User } = require("../../../../models/user");
const { UserDetail } = require("../../../../models/userDetail");

const _ = require("lodash");
const req = require("supertest");

let server;

//
//
describe("/api/userDetails/cards", () => {
   //
   beforeEach(() => {
      server = require("../../../../index");
   });

   afterEach(async () => {
      await User.remove();
      await server.close();
   });

   //
   //
   //

   describe("GET /me", () => {
      let token;
      let user_data;
      let user;
      let userDetails_data;
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

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .get(`/api/userDetails/cards/me`)
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

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return users addresses if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toHaveLength(2);
         expect(res.body[0]).toMatchObject(userDetails_data.cards[0]);
         expect(res.body[1]).toMatchObject(userDetails_data.cards[1]);
      });
   });

   //
   //
   describe("GET /:id", () => {
      let id;
      let token;
      let user_data;
      let user;
      let userDetails_data;
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

         token = user.generateAuthToken();
         id = userDetails.cards[0]._id;
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .get(`/api/userDetails/cards/${id}`)
            .set("x-auth-token", token);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 404 if given Id is ivalid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 404 if userDetails.cards with given address Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return users addresses if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(userDetails_data.cards[0]);
      });
   });

   //
   //
   describe("POST /", () => {
      let token;
      let user_data;
      let user;
      let userDetails_data;
      let userDetails;
      let cards_data;

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
            cards: [],
         };

         userDetails = new UserDetail(userDetails_data);
         await userDetails.save();

         user.userDetails = userDetails._id;
         await user.save();

         cards_data = {
            name: "UPDATED State Bank",
            cardNumber: "UPDATED ABC4h456",
         };

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .post(`/api/userDetails/cards/`)
            .set("x-auth-token", token)
            .send(cards_data);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      //
      it("should return 400 if name is not passed", async () => {
         cards_data = _.omit(cards_data, ["name"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if name is lesser then 5 character", async () => {
         cards_data.name = "abcd";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if name is greater then 50 character", async () => {
         cards_data.name = new Array(52).join("A");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if cardNumber is not passed", async () => {
         cards_data = _.omit(cards_data, ["cardNumber"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if cardNumber is lesser then 8 character", async () => {
         cards_data.cardNumber = "number";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if cardNumber is greater then 30 character", async () => {
         cards_data.cardNumber = new Array(32).join("C");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 404 if user with given user Id was Not Found", async () => {
         const data = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: false,
         };
         token = new User(data).generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 404 if userDetail for given user Id was Not Found", async () => {
         await UserDetail.remove();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return added card if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body[0]).toMatchObject(cards_data);
      });
   });

   //
   //
   describe("PUT /:id", () => {
      let id;
      let token;
      let user_data;
      let userDetails_data;
      let address_data;
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

         cards_data = {
            name: "UPDATED State Bank",
            cardNumber: "UPDATED ABC4h456",
         };

         token = user.generateAuthToken();
         id = userDetails.cards[0]._id;
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .put(`/api/userDetails/cards/${id}`)
            .set("x-auth-token", token)
            .send(cards_data);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 404 if given Id is ivalid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      // ... Already tested in POST

      //
      it("should return 404 if user with given user Id was Not Found", async () => {
         const data = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: false,
         };
         token = new User(data).generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 404 if userDetail for given user Id was Not Found", async () => {
         await UserDetail.remove();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 404 if address for given Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return added card if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(cards_data);
      });

      it("should check if its updated in DB", async () => {
         const res = await exec();

         const result = (await UserDetail.findById(userDetails._id)).toObject();
         result.cards[0]._id = result.cards[0]._id.toHexString();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(result.cards[0]);
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

         token = user.generateAuthToken();
         id = userDetails.cards[0]._id;
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .delete(`/api/userDetails/cards/${id}`)
            .set("x-auth-token", token);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 404 if given Id is ivalid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 404 if address for given Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      //
      it("should return 200 if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return deleted address if user is logged in", async () => {
         const res = await exec();

         let address_0 = userDetails.cards[0].toObject();
         address_0._id = address_0._id.toHexString();

         expect(res.status).toBe(200);
         expect(res.body[0]).toMatchObject(address_0);
      });

      it("should check if its updated in DB", async () => {
         const res = await exec();

         const address1 = await UserDetail.findOne({
            "addresses._id": id,
         });

         let id2 = userDetails.cards[1]._id.toHexString();
         const address2 = await UserDetail.findOne({
            "addresses._id": id2,
         });

         expect(res.status).toBe(200);
         expect(address1).toBeNull();
      });
   });
});
