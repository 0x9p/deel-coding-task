const express = require("express");
const bodyParser = require("body-parser");

const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const { getAdminRouter } = require("./routes/v1/admin/admin.router");
const { getBalanceRouter } = require("./routes/v1/balance/balance.router");
const { getContractRouter } = require("./routes/v1/contract/contract.router");
const { getJobRouter } = require("./routes/v1/job/job.router");

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use("/admin/", getProfile, getAdminRouter());
app.use("/balances/", getProfile, getBalanceRouter());
app.use("/contracts/", getProfile, getContractRouter());
app.use("/jobs/", getProfile, getJobRouter());

module.exports = app;
