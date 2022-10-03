const { StatusCodes } = require("http-status-codes");

const { ProfileType } = require("../../../constants");

class BalanceHandler {
  // "Deposits money into the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)"
  // TODO: I'm not sure that got this requirement correctly, it seems wrong.
  // - Who should deposit money a client or contractor?
  // - Why this person can't deposit more than 25%?
  // - What DTO should be used for payload?
  async deposit(req, res) {
    if (req.profile.type !== ProfileType.CLIENT) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    const { userId } = req.params;
    const { quantity } = req.body;

    const sequelize = req.app.get("sequelize");
    const { Profile } = req.app.get("models");

    const targetProfile = await Profile.findOne({
      where: { id: userId, type: ProfileType.CLIENT },
    });

    if (!targetProfile) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    const newClientBalance = req.profile.balance - quantity;

    if (newClientBalance < 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const t = await sequelize.transaction();

    try {
      req.profile.balance = newClientBalance;
      await req.profile.save({ transaction: t });

      targetProfile.balance += quantity;
      await targetProfile.save({ transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    res.status(StatusCodes.NO_CONTENT).end();
  }
}

module.exports = { BalanceHandler };
