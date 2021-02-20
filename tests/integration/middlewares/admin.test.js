const req = require("supertest");
const { User } = require("../../../models/user");
const { Category } = require("../../../models/category");

let server;

describe("/api/categories", () => {
   let token;
   let user_data;

   beforeEach(async () => {
      server = require("../../../index");
      user_data = {
         name: "ABCDEF",
         email: "abcdef@xyz.com",
         password: "12345678",
         isAdmin: true,
      };
      token = new User(user_data).generateAuthToken();
   });

   afterEach(async () => {
      await Category.remove();
      await User.remove();
      await server.close();
   });

   const exec = () => {
      return req(server)
         .post("/api/categories")
         .set("x-auth-token", token)
         .send({ name: "category1" });
   };

   //
   describe("POST /", () => {
      it("should return 401 if no token is provided", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if user is not Admin", async () => {
         user_data.isAdmin = false;
         token = new User(user_data).generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return 200 if user is Admin", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });
   });
});
