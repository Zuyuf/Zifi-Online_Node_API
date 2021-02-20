const req = require("supertest");
const _ = require("lodash");
const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

let server;

//
//
describe("/api/auth", () => {
   //
   beforeEach(() => {
      server = require("../../../index");
   });

   afterEach(async () => {
      await server.close();
   });

   //
   //
   describe("POST /", () => {
      let send_data;
      let user_data;
      let user;

      beforeEach(async () => {
         user_data = {
            name: "abcdef",
            email: "abcdef@xyz.com",
            password: "12345",
            isAdmin: true,
         };

         send_data = {
            email: "abcdef@xyz.com",
            password: "12345",
         };

         user = new User(user_data);
         const salt = await bcrypt.genSalt(config.get("bcryptSaltKey"));
         user.password = await bcrypt.hash(user.password, salt);
         await user.save();
      });

      afterEach(async () => {
         await User.remove();
      });

      const exec = () => {
         return req(server).post("/api/auth").send(send_data);
      };

      //
      it("should return 400 if email is not provided", async () => {
         send_data = _.pick(send_data, ["password"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if email is not valid", async () => {
         send_data.email = "email";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if email is greater then 255 characters", async () => {
         let name = new Array(257).join("a");
         send_data.email = `${name}@xyz.com`;

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if password is provided", async () => {
         send_data = _.pick(send_data, ["email"]);

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if password less then 5 characters", async () => {
         send_data.password = "1234";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if password is greater then 255 characters", async () => {
         let password = new Array(257).join("a");
         send_data.password = password;

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 400 if email was Not Found!", async () => {
         send_data.email = "email@xyz.com";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if password was Incorrect", async () => {
         send_data.password = "incorrectPassword";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      //
      it("should return 200 if logged in", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });

      it("should return token if logged in", async () => {
         const res = await exec();

         const decoded = jwt.verify(
            res.body.token,
            config.get("jwtPrivateKey")
         );

         expect(res.status).toBe(200);
         expect(decoded).toHaveProperty("_id");
      });
   });
});
