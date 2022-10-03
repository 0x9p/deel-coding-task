const { Op } = require("sequelize");

const { ProfileType } = require("../../../constants");

class AdminHandler {
  async getBestProfession(req, res) {
    const { start, end } = req.query;
    const sequelize = req.app.get("sequelize");
    const { Profile, Contract, Job } = req.app.get("models");

    const result = await Profile.findAll({
      attributes: [
        "profession",
        [sequelize.fn("sum", sequelize.col("price")), "total"],
      ],
      where: { type: "contractor" },
      group: "profession",
      include: [
        {
          model: Contract,
          as: "Contractor",
          attributes: [],
          include: [
            {
              model: Job,
              where: {
                paid: true,
                paymentDate: { [Op.between]: [start, end] },
              },
              attributes: [],
            },
          ],
        },
      ],
      order: [[sequelize.col("total"), "DESC"]],
    });

    res.json(result);
  }

  async getBestClients(req, res) {
    const { start, end, limit } = req.query;
    const sequelize = req.app.get("sequelize");
    const { Profile, Contract, Job } = req.app.get("models");

    const result = await Profile.findAll({
      attributes: [
        "id",
        [sequelize.literal("firstName || ' ' || lastName"), "fullName"],
        [sequelize.fn("sum", sequelize.col("price")), "paid"],
      ],
      where: { type: ProfileType.CLIENT },
      group: "Profile.id",
      include: [
        {
          duplicating: false,
          model: Contract,
          as: "Client",
          attributes: [],
          include: [
            {
              duplicating: false,
              model: Job,
              attributes: [],
              where: {
                paid: true,
                paymentDate: { [Op.between]: [start, end] },
              },
            },
          ],
        },
      ],
      order: [[sequelize.col("paid"), "DESC"]],
      limit,
    });
    res.json(result);
  }
}

module.exports = { AdminHandler };
