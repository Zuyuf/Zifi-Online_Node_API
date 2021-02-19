const req = require("supertest");
const { User } = require("../../../models/user");
let server;

describe("/api/categories", () => {
   let token;
   let user_data;
   let user;

   beforeEach(async () => {
      server = require("../../../index");
      user_data = {
         name: "ABCDEF",
         email: "abcdef@xyz.com",
         password: "12345678",
         isAdmin: true,
      };
      user = new User(user_data);
      await user.save();
      token = user.generateAuthToken();
   });

   afterEach(async () => {
      await User.remove();
      await server.close();
   });

   const exec = () => {
      return req(server).get("/api/users/me").set("x-auth-token", token);
   };

   //
   describe("GET /", () => {
      it("should return 401 if no token is provided", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 400 if token is invalid", async () => {
         token = "invalid token";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 200 if token is valid", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });
   });
});
