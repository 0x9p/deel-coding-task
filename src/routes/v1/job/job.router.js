const express = require("express");

const { JobHandler } = require("./job.handler");

function getJobRouter() {
  const router = express.Router();
  const handler = new JobHandler();

  router.get("/unpaid", handler.getUnpaidJobs);
  router.post("/:id/pay", handler.payJob);

  return router;
}

module.exports = { getJobRouter };
