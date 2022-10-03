const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");

const { ProfileType, ContractStatus } = require("../../../constants");

class JobHandler {
  async getUnpaidJobs(req, res) {
    const { id } = req.profile;
    const { Job, Contract } = req.app.get("models");

    const contractsWithUnpaidJobs = await Contract.findAll({
      include: [{ model: Job, required: true, where: { paid: false } }],
      where: {
        status: { [Op.ne]: ContractStatus.TERMINATED },
        [Op.or]: [{ ContractorId: id }, { ClientId: id }],
      },
    });

    const unpaidJobs = contractsWithUnpaidJobs.map(({ Jobs }) => Jobs).flat();

    res.json(unpaidJobs);
  }

  async payJob(req, res) {
    if (req.profile.type !== ProfileType.CLIENT) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    const sequelize = req.app.get("sequelize");
    const { Job, Contract, Profile } = req.app.get("models");

    const payingJob = await Job.findOne({
      include: [
        {
          model: Contract,
          required: true,
          include: { model: Profile, required: true, as: "Contractor" },
        },
      ],
      where: { id: req.params.id, paid: false },
    });

    if (!payingJob) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    const newClientBalance = req.profile.balance - payingJob.price;

    if (newClientBalance < 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const { Contractor: contractorProfile } = payingJob.Contract;

    const t = await sequelize.transaction();

    try {
      payingJob.paid = true;
      payingJob.paymentDate = new Date();
      await payingJob.save({ transaction: t });

      req.profile.balance = newClientBalance;
      await req.profile.save({ transaction: t });

      contractorProfile.balance += payingJob.price;
      await contractorProfile.save({ transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    res.status(StatusCodes.NO_CONTENT).end();
  }
}

module.exports = { JobHandler };
