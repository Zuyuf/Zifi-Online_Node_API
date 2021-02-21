const req = require("supertest");
const _ = require("lodash");
const { Category } = require("../../../models/category");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const { UserDetail } = require("../../../models/userDetail");

let server;

//
//
describe("/api/users", () => {
   //
   beforeEach(() => {
      server = require("../../../index");
   });
   afterEach(async () => {
      await server.close();
      await Category.remove();
   });

   //
   //
   describe("GET /me", () => {
      let token;
      let user;

      beforeEach(async () => {
         user_data = {
            name: "ABCDEF",
            email: "abcdef@xyz.com",
            password: "12345678",
            isAdmin: false,
         };
         user = new User(user_data);
         await user.save();

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
      });

      const exec = () => {
         return req(server).get("/api/users/me").set("x-auth-token", token);
      };

      //
      it("should return 401 if client is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return user if client is logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty("_id");
         expect(res.body).toHaveProperty("name", "ABCDEF");
         expect(res.body).toHaveProperty("email", "abcdef@xyz.com");
         expect(res.body).toHaveProperty("isAdmin", false);
      });
   });

   //
   //
   describe("GET /all", () => {
      let user_data;
      let user;
      let token;

      beforeEach(async () => {
         await User.collection.insertMany([
            {
               name: "MNOPQRS",
               email: "mnopqrs@xyz.com",
               password: "12345678",
               isAdmin: true,
            },
            {
               name: "HIJKLMN",
               email: "hijklmn@xyz.com",
               password: "987654321",
               isAdmin: false,
            },
         ]);

         user_data = {
            name: "ABCDEF",
            email: "abcdef@xyz.com",
            password: "12345678",
            isAdmin: true,
         };

         token = new User(user_data).generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
      });

      const exec = () => {
         return req(server).get("/api/users/all").set("x-auth-token", token);
      };

      //
      it("should return 401 if client is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if client is not admin", async () => {
         user_data.isAdmin = false;
         token = new User(user_data).generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return users if client is admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).not.toBeNull();
      });
   });

   //
   //
   describe("POST /", () => {
      let user_data;

      beforeEach(async () => {
         user_data = {
            name: "ABCDEF",
            email: "abcdef@xyz.com",
            password: "12345678",
            isAdmin: true,
            temp1: "shouldnot save this",
         };
      });

      afterEach(async () => {
         await User.remove();
      });

      const exec = () => {
         return req(server).post("/api/users/").send(user_data);
      };

      //
      it("should return 400 if name is not provided", async () => {
         user_data = _.pick(user_data, [
            "email",
            "password",
            "isAdmin",
            "temp1",
         ]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if name is less then 5 characters", async () => {
         user_data.name = "ABCD";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if name is greater then 50 characters", async () => {
         user_data.name = new Array(52).join("a");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if email is not provided", async () => {
         user_data = _.pick(user_data, [
            "name",
            "password",
            "isAdmin",
            "temp1",
         ]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if email is not valid", async () => {
         user_data.email = "email";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if email is greater then 255 characters", async () => {
         let name = new Array(257).join("a");
         user_data.email = `${name}@xxxyyyzzz.com`;

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if password is not provided", async () => {
         user_data = _.pick(user_data, ["email", "name", "isAdmin", "temp1"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if password is not valid", async () => {
         user_data.email = "1234";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if password is greater then 255 characters", async () => {
         let password = new Array(257).join("a");
         user_data.password = password;

         const res = await exec();

         expect(res.status).toBe(400);
      });
   });

   //
   //
   describe("DELETE /me", () => {
      let user_data;
      let userDetails_data;
      let user;
      let userDetails;
      let token;

      beforeEach(async () => {
         user_data = {
            name: "ABCDEF",
            email: "abcdef@xyz.com",
            password: "12345678",
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

         user.userDetails = userDetails._id;
         await user.save();

         token = user.generateAuthToken();
      });

      afterEach(async () => {
         await User.remove();
      });

      const exec = () => {
         return req(server).delete("/api/users/me").set("x-auth-token", token);
      };

      //
      it("should return 401 if client is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should delete user if client is logged in", async () => {
         const res = await exec();

         const user1 = await User.find({ email: user_data.email });
         const userDetails1 = await UserDetail.find({ _id: userDetails._id });

         expect(res.status).toBe(200);
         expect(user1).toHaveLength(0);
         expect(userDetails1).toHaveLength(0);
      });

      it("should return user if client is deleted", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty("_id");
         expect(res.body).toHaveProperty("name", "ABCDEF");
         expect(res.body).toHaveProperty("email", "abcdef@xyz.com");
      });
   });

   //
   //
   describe("DELETE /:id", () => {
      let user_data;
      let user;
      let token;
      let id;

      beforeEach(async () => {
         user_data = {
            name: "ABCDEF",
            email: "abcdef@xyz.com",
            password: "12345678",
            isAdmin: true,
         };

         user = new User(user_data);
         await user.save();

         token = user.generateAuthToken();

         id = user._id;
      });

      afterEach(async () => {
         await User.remove();
      });

      const exec = () => {
         return req(server)
            .delete(`/api/users/${id}`)
            .set("x-auth-token", token);
      };

      //
      it("should return 401 if client is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if client is not Admin", async () => {
         await User.remove();

         user_data.isAdmin = false;
         user = new User(user_data);
         await user.save();

         token = user.generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return 404 if user Id is not a valid ObjectId", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 404 if user Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toHexString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should delete user if client is Admin", async () => {
         const res = await exec();

         const user = await User.find({ email: user_data.email });

         expect(user).toHaveLength(0);
      });

      it("should return user if deleted", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty("_id");
         expect(res.body).toHaveProperty("name", "ABCDEF");
         expect(res.body).toHaveProperty("email", "abcdef@xyz.com");
      });
   });

   //
   //
});
