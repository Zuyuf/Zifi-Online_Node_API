const admin = require("../../../middlewares/admin");

describe("isAdmin middleware", () => {
   let res;
   let req;
   let nxt;

   beforeEach(() => {
      let holder = true;

      res = {
         status: function (code) {
            return {
               send: function (msg) {
                  return code;
               },
            };
         },
      };

      req = { user: { isAdmin: true } };

      nxt = function () {
         return true;
      };
   });

   //
   it("should return 403 if user is not Admin", () => {
      req.user.isAdmin = false;

      const result = admin(req, res, nxt);

      expect(result).toBe(403);
   });
});
