const req = require("supertest");
const { Category } = require("../../../models/category");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

let server;

describe("/api/categories", () => {
   beforeEach(() => {
      server = require("../../../index");
   });
   afterEach(async () => {
      await server.close();
      await Category.remove();
   });

   //
   //
   describe("GET /", () => {
      it("should return all categories", async () => {
         await Category.collection.insertMany([
            { name: "category1" },
            { name: "category2" },
         ]);

         const res = await req(server).get("/api/categories");

         expect(res.status).toBe(200);
         expect(res.body.some((c) => c.name === "category1")).toBeTruthy();
         expect(res.body.some((c) => c.name === "category2")).toBeTruthy();
      });
   });

   //
   //
   describe("GET /:id", () => {
      it("should 404 if invalid ID is passed", async () => {
         const res = await req(server).get("/api/categories/1");

         expect(res.status).toBe(404);
      });

      it("should return a category if valid ID is passed", async () => {
         const category = new Category({ name: "category1" });
         await category.save();

         const res = await req(server).get("/api/categories/" + category._id);

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty("name", category.name);
      });
   });

   //
   //
   describe("POST /", () => {
      let token;
      let name;
      let user_data;

      beforeEach(() => {
         user_data = {
            name: "ABCDEF",
            email: "abcdef@xyz.com",
            password: "12345678",
            isAdmin: true,
         };
         name = "category1";
         token = new User(user_data).generateAuthToken();
      });

      afterEach(async () => {
         await Category.remove();
         await User.remove();
      });

      const exec = async () => {
         return await req(server)
            .post("/api/categories")
            .set("x-auth-token", token)
            .send({ name });
      };

      it("should return 401 if client is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if client is not Admin", async () => {
         user_data.isAdmin = false;
         token = new User(user_data).generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return 400 if category is less then 5 characters", async () => {
         name = "1234";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if category is more then 50 characters", async () => {
         name = new Array(52).join("a");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should save category if it is valid", async () => {
         await exec();

         const category = await Category.find({ name: name });

         expect(category).not.toBeNull();
      });

      it("should return category if it is valid", async () => {
         const res = await exec();

         expect(res.body).toHaveProperty("_id");
         expect(res.body).toHaveProperty("name", name);
      });
   });

   //
   //
   describe("PUT /:id", () => {
      let token;
      let name;
      let id;
      let user_data;
      let category;

      beforeEach(async () => {
         user_data = {
            name: "ABCDEF",
            email: "abcdef@xyz.com",
            password: "12345678",
            isAdmin: true,
         };
         name = "updated category";
         token = new User(user_data).generateAuthToken();

         category = new Category({ name: "category1" });
         await category.save();

         id = category._id;
      });

      afterEach(async () => {
         await Category.remove();
         await User.remove();
      });

      const exec = async () => {
         return await req(server)
            .put(`/api/categories/${id}`)
            .set("x-auth-token", token)
            .send({ name });
      };

      //
      it("should return 401 if client is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if client is not Admin", async () => {
         user_data.isAdmin = false;
         token = new User(user_data).generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return 404 if category id is invalid", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 400 if category is less then 5 characters", async () => {
         name = "1234";

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 400 if category is more then 50 characters", async () => {
         name = new Array(52).join("a");

         const res = await exec();

         expect(res.status).toBe(400);
      });

      it("should return 404 if category with given Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should updated category if Id is valid", async () => {
         await exec();

         const category = await Category.find({ name });

         expect(category).not.toBeNull();
      });

      it("should return category if Id is valid", async () => {
         const res = await exec();

         expect(res.body).toHaveProperty("_id");
         expect(res.body).toHaveProperty("name", name);
      });
   });

   //
   //
   describe("DELETE /:id", () => {
      let token;
      let name;
      let id;
      let user_data;
      let category;

      beforeEach(async () => {
         user_data = {
            name: "ABCDEF",
            email: "abcdef@xyz.com",
            password: "12345678",
            isAdmin: true,
         };
         name = "category1";
         token = new User(user_data).generateAuthToken();

         category = new Category({ name });
         await category.save();

         id = category._id;
      });

      afterEach(async () => {
         await Category.remove();
         await User.remove();
      });

      const exec = async () => {
         return await req(server)
            .delete(`/api/categories/${id}`)
            .set("x-auth-token", token);
      };

      //
      it("should return 401 if client is not logged in", async () => {
         token = "";

         const res = await exec();

         expect(res.status).toBe(401);
      });

      it("should return 403 if client is not Admin", async () => {
         user_data.isAdmin = false;
         token = new User(user_data).generateAuthToken();

         const res = await exec();

         expect(res.status).toBe(403);
      });

      it("should return 404 if category id is invalid", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 404 if category with given Id was Not Found", async () => {
         id = mongoose.Types.ObjectId().toString();

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should delete category if Id is valid", async () => {
         await exec();

         const category = await Category.find({ name });

         expect(category).toHaveLength(0);
      });

      it("should return category if Id is valid", async () => {
         const res = await exec();

         expect(res.body).toHaveProperty("_id");
         expect(res.body).toHaveProperty("name", name);
      });
   });
});
