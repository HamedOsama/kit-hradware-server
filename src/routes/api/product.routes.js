const { Router } = require('express');
const productController = require('../../controllers/product.controller');
const { resizeProductImages, uploadProductImages } = require('../../utils/UploadImage');
// const Uploads = require('../../utils/UploadImage');
// const { authUser } = require('../../middleware/userAuth');

const routes = Router();

routes.route('/').post(uploadProductImages, resizeProductImages, productController.createProduct).get(productController.getAll);
routes.route('/:id')
  .get(productController.getProductById)
routes.route('/category/categories').get(productController.getAllCat)
// routes.route('/:orderId').get(productController.getOrder)
module.exports = routes
