const req = require("supertest");
const { Category } = require("../../../models/category");

let server;

describe("/api/categories", () => {
   let category;
   let id;

   beforeEach(async () => {
      server = require("../../../index");

      category = new Category({ name: "category1" });
      await category.save();

      id = category._id;
   });

   afterEach(async () => {
      await Category.remove();
      await server.close();
   });

   const exec = () => {
      return req(server).get(`/api/categories/${id}`);
   };

   //
   describe("GET /:id", () => {
      it("should return 404 if Id is invalid", async () => {
         id = "1";

         const res = await exec();

         expect(res.status).toBe(404);
      });

      it("should return 200 if Id is valid", async () => {
         const res = await exec();

         expect(res.status).toBe(200);
      });
   });
});
