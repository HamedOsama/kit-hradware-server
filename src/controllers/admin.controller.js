const { customAlphabet } = require('nanoid');

const ServerError = require("../utils/ErrorInterface");
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const Maintenances = require('../models/maintenance');
const Product = require('../models/product');
const Order = require('../models/order');


const alphabet = '0123456789';
const nanoid = customAlphabet(alphabet, 12);

// maintenance
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
    const maintenance = await Maintenances.findByIdAndUpdate(id,
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
// product
const addProduct = async (req, res, next) => {
  try {
    const product = new Product({ ...req.body })
    await product.save();
    res.status(201).json({
      ok: true,
      code: 201,
      message: 'succeeded',
      body: product
    })
  } catch (e) {
    next(e);
  }
}
const getAllProducts = async (req, res, next) => {
  try {
    req.query.category = req?.query?.category?.split(',')
    const Query = new APIFeatures(Product.find({}, '-__v'), req?.query).filter().sort().paginate()
    const lengthQuery = new APIFeatures(Product.find({}), req?.query).filter()
    const [products, totalLength] = await Promise.all([Query.query, lengthQuery.query])
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: products,
      totalLength: totalLength.length,
    });
  } catch (e) {
    next(e)
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const product = await Product.findByIdAndUpdate(id,
      { ...req.body },
      { runValidators: true, new: true }
    );
    if (!product)
      return next(ServerError.badRequest(404, 'product not found'))
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: product
    })
  } catch (e) {
    next(e);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return next(ServerError.badRequest(404, 'product not found'))
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

const getAllOrders = async (req, res, next) => {
  try {
    const ordersQuery = new APIFeatures(Order.find(), req?.query).filter().sort().limitFields().paginate();
    const lengthQuery = new APIFeatures(Order.find(), req?.query).filter();
    const [orders, totalLength] = await Promise.all([ordersQuery.query, lengthQuery.query]);
    console.log(totalLength.length)
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: orders,
      totalLength: totalLength.length
    })
  } catch (e) {
    next(e);
  }
};
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const order = await Order.findByIdAndUpdate(id,
      { ...req.body },
      { runValidators: true, new: true }
    );
    if (!order)
      return next(ServerError.badRequest(404, 'order not found'))
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: order
    })
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addMaintenance,
  getAllMaintenances,
  updateMaintenance,
  deleteMaintenance,
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrder,
};