const express = require("express");

const { BalanceHandler } = require("./balance.handler");

function getBalanceRouter() {
  const router = express.Router();
  const handler = new BalanceHandler();

  router.post("/deposit/:userId", handler.deposit);

  return router;
}

module.exports = { getBalanceRouter };
