const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");

const { ContractStatus } = require("../../../constants");

class ContractHandler {
  async getContracts(req, res) {
    const contracts = await req.profile.getContracts({
      where: { status: { [Op.ne]: ContractStatus.TERMINATED } },
    });
    res.json(contracts);
  }

  async getContractById(req, res) {
    const { id } = req.params;
    const contract = await req.profile.getContract({ where: { id } });
    if (!contract) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
    res.json(contract);
  }
}

module.exports = { ContractHandler };
