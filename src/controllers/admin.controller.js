const { customAlphabet } = require('nanoid');

const Maintenances = require('../models/maintenance');
const ServerError = require("../utils/ErrorInterface");
const APIFeatures = require('../utils/apiFeatures');
const Order = require('../models/order');
const User = require('../models/userModel');


const alphabet = '0123456789';
const nanoid = customAlphabet(alphabet, 12);

const addMaintenance = async (req, res, next) => {
  try {
    const { status, phone } = req.body;
    if (status !== 'under maintenance' && status !== 'done' && status) {
      return next(ServerError.badRequest(400, 'wrong status'))
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return next(ServerError.badRequest(404, 'user not found'))
    }
    const maintenance = new Maintenances({
      ...req.body,
      username: user.name,
      email: user.email,

    })
    await maintenance.save();

    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: maintenance
    })
  } catch (e) {
    next(e);
  }
};

const getAllMaintenances = async (req, res, next) => {
  try {
    const maintenancesQuery = new APIFeatures(Maintenances.find(), req?.query).filter().sort().limitFields().paginate();
    const lengthQuery = Maintenances.countDocuments();

    const [maintenances, totalLength] = await Promise.all([maintenancesQuery.query, lengthQuery]);
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: maintenances,
      totalLength
    })
  } catch (e) {
    next(e);
  }
};

const updateMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const { status } = req.body;
    if (status !== 'under maintenance' && status !== 'done' && status) {
      return next(ServerError.badRequest(400, 'wrong status'))
    }
    const maintenance = await Maintenances.findByIdAndUpdate( id,
      { ...req.body },
      { runValidators: true, new: true }
    );
    if (!maintenance) {
      return next(ServerError.badRequest(404, 'maintenance not found'))
    }
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: maintenance
    })
  } catch (e) {
    next(e);
  }
};

const deleteMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const maintenance = await Maintenances.findByIdAndDelete(id);
    if (!maintenance) {
      return next(ServerError.badRequest(404, 'maintenance not found'))
    }
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
    })
  } catch (e) {
    next(e);
  }
};



module.exports = {
  addMaintenance,
  getAllMaintenances,
  updateMaintenance,
  deleteMaintenance
};