const request = require("supertest");
const { StatusCodes } = require("http-status-codes");

const app = require("../../../src/app");

describe("Admin Router", () => {
  describe("GET /admin/best-profession", () => {
    it("should return best professions", async () => {
      const result = await request(app)
        .get("/admin/best-profession?start=2020-01-01&end=2021-01-01")
        .set("profile_id", 1);

      expect(result.status).toEqual(StatusCodes.OK);
      expect(result.body).toEqual([
        {
          profession: "Programmer",
          total: 2683,
        },
        {
          profession: "Musician",
          total: 221,
        },
        {
          profession: "Fighter",
          total: 200,
        },
      ]);
    });
  });

  describe("GET /admin/best-clients", () => {
    it("should return best clients", async () => {
      const result = await request(app)
        .get("/admin/best-clients?start=2020-01-01&end=2021-01-01")
        .set("profile_id", 1);

      expect(result.status).toEqual(StatusCodes.OK);
      expect(result.body).toEqual([
        {
          fullName: "Ash Kethcum",
          id: 4,
          paid: 2020,
        },
        {
          fullName: "Harry Potter",
          id: 1,
          paid: 442,
        },
      ]);
    });
  });
});
