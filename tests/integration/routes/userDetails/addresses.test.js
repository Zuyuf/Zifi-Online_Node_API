const mongoose = require("mongoose");
const { User } = require("../../../../models/user");
const { UserDetail } = require("../../../../models/userDetail");

const _ = require("lodash");
const req = require("supertest");

let server;

//
//
describe("/api/userDetails/addresses", () => {
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
            .get(`/api/userDetails/addresses/me`)
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
         expect(res.body[0]).toMatchObject(userDetails_data.addresses[0]);
         expect(res.body[1]).toMatchObject(userDetails_data.addresses[1]);
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
         id = userDetails.addresses[0]._id;
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .get(`/api/userDetails/addresses/${id}`)
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

      it("should return 404 if userDetails.addresses with given address Id was Not Found", async () => {
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
         expect(res.body).toMatchObject(userDetails_data.addresses[0]);
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
      let address_data;

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
            addresses: [],
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

         address_data = {
            name: "Home Address",
            line1: "01234567890123",
            line2: "01234567890123",
            pincode: "X87BH112",
            phoneNumber: 123456789,
            landMark: "land Mark...",
         };

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .post(`/api/userDetails/addresses/`)
            .set("x-auth-token", token)
            .send(address_data);
      };

      //
      it("should return 401 if user is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      //
      it("should return 400 if name is not passed", async () => {
         address_data = _.omit(address_data, ["name"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if name is lesser then 5 character", async () => {
         address_data.name = "abcd";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if name is greater then 50 character", async () => {
         address_data.name = new Array(52).join("A");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if line1 is not passed", async () => {
         address_data = _.omit(address_data, ["line1"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if line1 is lesser then 10 character", async () => {
         address_data.line1 = "abcdABCD";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if line1 is greater then 100 character", async () => {
         address_data.line1 = new Array(102).join("A");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if line2 is not passed", async () => {
         address_data = _.omit(address_data, ["line2"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if line2 is lesser then 10 character", async () => {
         address_data.line2 = "abcdABCD";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if line2 is greater then 100 character", async () => {
         address_data.line2 = new Array(102).join("A");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if pincode is not passed", async () => {
         address_data = _.omit(address_data, ["pincode"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if pincode is lesser then 4 character", async () => {
         address_data.pincode = "cod";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if pincode is greater then 10 character", async () => {
         address_data.pincode = new Array(12).join("C");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if phoneNumber is not passed", async () => {
         address_data = _.omit(address_data, ["phoneNumber"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if phoneNumber is lesser then 5 character", async () => {
         address_data.phoneNumber = 1234;

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if phoneNumber is greater then 20 character", async () => {
         address_data.phoneNumber = parseInt(new Array(22).join("1"));

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if landMark is not passed", async () => {
         address_data = _.omit(address_data, ["landMark"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if landMark is lesser then 5 character", async () => {
         address_data.landMark = "land";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if landMark is greater then 50 character", async () => {
         address_data.landMark = new Array(52).join("L");

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
         console.log(
            ">>>>>>    return 200 if user is logged in : data :  ",
            await User.findById(user._id)
         );

         const res = await exec();
         console.log(">>>>>>    res.body :  ", res.body);

         expect(res.status).toBe(200);
      });

      it("should return added address if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body[0]).toMatchObject(address_data);
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

         address_data = {
            name: "UPDATED Address",
            line1: "UPDATED  01234567890123",
            line2: "UPDATED  01234567890123",
            pincode: "UPDATED99",
            phoneNumber: 991188227733,
            landMark: "UPDATED land Mark",
         };

         token = user.generateAuthToken();
         id = userDetails.addresses[0]._id;
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .put(`/api/userDetails/addresses/${id}`)
            .set("x-auth-token", token)
            .send(address_data);
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

      it("should return added address if user is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(address_data);
      });

      it("should check if its updated in DB", async () => {
         const res = await exec();

         const result = (await UserDetail.findById(userDetails._id)).toObject();
         result.addresses[0]._id = result.addresses[0]._id.toHexString();

         expect(res.status).toBe(200);
         expect(res.body).toMatchObject(result.addresses[0]);
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
         id = userDetails.addresses[0]._id;
      });

      afterEach(async () => {
         await User.remove();
         await UserDetail.remove();
      });

      const exec = () => {
         return req(server)
            .delete(`/api/userDetails/addresses/${id}`)
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

         let address_0 = userDetails.addresses[0].toObject();
         address_0._id = address_0._id.toHexString();

         expect(res.status).toBe(200);
         expect(res.body[0]).toMatchObject(address_0);
      });

      it("should check if its updated in DB", async () => {
         const res = await exec();

         const address1 = await UserDetail.findOne({
            "addresses._id": id,
         });

         let id2 = userDetails.addresses[1]._id.toHexString();
         const address2 = await UserDetail.findOne({
            "addresses._id": id2,
         });

         expect(res.status).toBe(200);
         expect(address1).toBeNull();
      });
   });
});
