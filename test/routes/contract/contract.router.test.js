const request = require("supertest");
const { StatusCodes } = require("http-status-codes");

const app = require("../../../src/app");

describe("Contract Router", () => {
  describe("GET /contracts", () => {
    it("should return active contracts for a client", async () => {
      const result = await request(app).get("/contracts").set("profile_id", 1);

      expect(result.status).toEqual(StatusCodes.OK);
      expect(result.body).toEqual([
        {
          id: 2,
          terms: "bla bla bla",
          status: "in_progress",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          ContractorId: 6,
          ClientId: 1,
        },
      ]);
    });

    it("should return active contracts for a contractor", async () => {
      const result = await request(app).get("/contracts").set("profile_id", 6);

      expect(result.status).toEqual(StatusCodes.OK);
      expect(result.body).toEqual([
        {
          id: 2,
          terms: "bla bla bla",
          status: "in_progress",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          ContractorId: 6,
          ClientId: 1,
        },
        {
          id: 3,
          terms: "bla bla bla",
          status: "in_progress",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          ContractorId: 6,
          ClientId: 2,
        },
        {
          id: 8,
          terms: "bla bla bla",
          status: "in_progress",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          ContractorId: 6,
          ClientId: 4,
        },
      ]);
    });
  });

  describe("GET /contracts/:id", () => {
    it("should return contract", async () => {
      const result = await request(app)
        .get("/contracts/1")
        .set("profile_id", 1);

      expect(result.status).toEqual(StatusCodes.OK);
      expect(result.body).toEqual({
        id: 1,
        terms: "bla bla bla",
        status: "terminated",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        ContractorId: 5,
        ClientId: 1,
      });
    });

    it("should return 401 for unauthorized request", async () => {
      const result = await request(app).get("/contracts/1");

      expect(result.status).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it("should return 404 for non-existing contract", async () => {
      const result = await request(app)
        .get("/contracts/1001")
        .set("profile_id", 1);

      expect(result.status).toEqual(StatusCodes.NOT_FOUND);
    });

    it("should return 404 if contract doesn't belong to the authorized user", async () => {
      const result = await request(app)
        .get("/contracts/7")
        .set("profile_id", 1);

      expect(result.status).toEqual(StatusCodes.NOT_FOUND);
    });
  });
});
