const express = require("express");

const { ContractHandler } = require("./contract.handler");

function getContractRouter() {
  const router = express.Router();
  const handler = new ContractHandler();

  router.get("/", handler.getContracts);
  router.get("/:id", handler.getContractById);

  return router;
}

module.exports = { getContractRouter };
