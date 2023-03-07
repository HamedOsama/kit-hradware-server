const ServerError = require("../utils/ErrorInterface");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authUser = async (req, res, next) => {
  try {

    const { access_token: token } = req.cookies;
    // console.log(req.cookies)
    if (!token) {
      return next(ServerError.badRequest(401, 'Please Login to access this resource'));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(token)
    const user = await User.findOne({ _id: decodedData.id, tokens: token });
    if (!user) {
      console.log('error')
      return next(ServerError.badRequest(401, 'Please Login to access this resource'));
    }
    console.log('found')
    req.user = user

    next();
  }
  catch (e) {
    e.statusCode = 401;
    next(e);
  }
};

// exports.authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHander(
//           `Role: ${req.user.role} is not allowed to access this resouce `,
//           403
//         )
//       );
//     }
//     next();
//   };
// };
