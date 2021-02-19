const { not } = require("joi");
const mongoose = require("mongoose");
const { UserDetail } = require("../../../models/userDetail");

describe("userDetail.pickReqiuredParams", () => {
   it("should return only requireed params..", () => {
      const payload = {
         temp1: "something",
         temp2: "something",
         user_id: new mongoose.Types.ObjectId().toString(),
         firstName: "a",
         lastName: "b",
         addresses: [
            {
               name: "home addr",
               line1: "hijk",
               line2: "efg2",
               pincode: "BG78L9",
            },
            {
               name: "work addr",
               line1: "hijk",
               line2: "efg2",
               pincode: "BG78L9",
            },
         ],
         homePhone: "123456",
         workPhone: "789789",
         cards: [
            { name: "personal card", cardNumber: "YYYYHHHH" },
            { name: "office card", cardNumber: "SSSSLLLL" },
         ],
      };

      const result = UserDetail.pickReqiuredParams(payload);

      expect(result).toHaveProperty("user_id");
      expect(result).toHaveProperty("firstName");
      expect(result).toHaveProperty("firstName");
      expect(result).toHaveProperty("homePhone");
      expect(result).toHaveProperty("workPhone");
      expect(result).toHaveProperty("addresses");
      expect(result).toHaveProperty("cards");

      expect(result).not.toHaveProperty("temp1");
      expect(result).not.toHaveProperty("temp2");
   });
});
