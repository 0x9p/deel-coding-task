const request = require("supertest");
const { StatusCodes } = require("http-status-codes");

const { seed } = require("../../../scripts/seedDb");
const app = require("../../../src/app");
const { Profile } = require("../../../src/model");

describe("Balance Router", () => {
  describe("GET /balances/deposit/:userId", () => {
    afterEach(seed);

    it("should deposit for a client", async () => {
      const result = await request(app)
        .post("/balances/deposit/2")
        .set("profile_id", 1)
        .send({ quantity: 100 });

      expect(result.status).toEqual(StatusCodes.NO_CONTENT);

      const srcProfile = await Profile.findByPk(1);
      expect(srcProfile.balance).toBe(1050);

      const destProfile = await Profile.findByPk(2);
      expect(destProfile.balance).toBe(331.11);
    });

    it("should return 404 for non-existing profile", async () => {
      const result = await request(app)
        .post("/balances/deposit/1001")
        .set("profile_id", 1)
        .send({ quantity: 100 });

      expect(result.status).toEqual(StatusCodes.NOT_FOUND);
    });

    it("should return 403 for non-client profile", async () => {
      const result = await request(app)
        .post("/balances/deposit/2")
        .set("profile_id", 6)
        .send({ quantity: 100 });

      expect(result.status).toEqual(StatusCodes.FORBIDDEN);
    });
  });
});
