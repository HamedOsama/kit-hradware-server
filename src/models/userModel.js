const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isMobilePhone(value, ['ar-EG'])) {
        throw new Error('Phone number is invalid')
      }
    }
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      // let strongPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
      if (value.length < 8)
        throw new Error("password length must be at least 8")
      // if (!strongPass.test(value))
        // throw new Error("password must contain at least one capital/small letter & special characters and number")
    }
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  street: {
    type: String,
    default: '',
    trim: true
  },
  building: {
    type: String,
    default: '',
    trim: true
  },
  floor: {
    type: String,
    default: '',
    trim: true
  },
  apartment: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'not-active'],
  },
  image: {
    type: String,
    default: '',
  },
  tokens: [{
    type: String,
    required: true
  }],
  resetLink: {
    type: String,
    default: ''
  }
})
userSchema.plugin(timestamps)
// userSchema.virtual('products', {
//     ref: 'products',
//     localField: '_id',
//     foreignField: 'seller'
// })
// userSchema.virtual('buyerOrders', {
//     ref: 'orders',
//     localField: '_id',
//     foreignField: 'buyerId'
// })
// userSchema.virtual('sellerOrders', {
//     ref: 'orders',
//     localField: '_id',
//     foreignField: 'sellerId'
// })

userSchema.pre('save', async function () {
  const user = this
  if (user.isModified('password'))
    user.password = await bcryptjs.hash(user.password, 8)
})

userSchema.statics.Login = async function (phone, pass) {
  const user = await User.findOne({ phone })
  if (!user)
    throw new Error('Phone is not found!');
  const isMatch = await bcryptjs.compare(pass, user.password)
  if (!isMatch)
    throw new Error('Password is wrong!')
  if (user.status !== 'active')
    throw new Error('not authorized you are blocked')
  return user
}
userSchema.methods.generateJWTToken = async function () {
  const user = this
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat(token)
  await user.save()
  return token
}
userSchema.methods.validatePassword = async function (password) {
  const user = this
  const isMatch = await bcryptjs.compare(password, user.password)
  return isMatch;
}
// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
userSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()
  delete userObj.password;
  // delete userObj.tokens;
  return userObj

}
const User = mongoose.model('users', userSchema)
module.exports = User;