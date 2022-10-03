const request = require("supertest");
const { StatusCodes } = require("http-status-codes");

const { seed } = require("../../../scripts/seedDb");
const app = require("../../../src/app");
const { Profile, Job } = require("../../../src/model");

describe("Job Router", () => {
  describe("GET /jobs/unpaid", () => {
    it("should return unpaid jobs", async () => {
      const result = await request(app)
        .get("/jobs/unpaid")
        .set("profile_id", 1);

      expect(result.status).toEqual(StatusCodes.OK);
      expect(result.body).toEqual([
        {
          id: 2,
          description: "work",
          price: 201,
          paid: false,
          paymentDate: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          ContractId: 2,
        },
      ]);
    });
  });

  describe("POST /jobs/:id/pay", () => {
    afterEach(seed);

    it("should pay for a job", async () => {
      const result = await request(app)
        .post("/jobs/2/pay")
        .set("profile_id", 1);

      expect(result.status).toEqual(StatusCodes.NO_CONTENT);

      const profile = await Profile.findByPk(1);
      expect(profile.balance).toBe(949);

      const job = await Job.findByPk(2);
      expect(job.paid).toBe(true);
    });
  });
});
