// Create Token and saving in cookie

const sendToken = async(user, statusCode, res) => {
  const token = await user.generateJWTToken();
  // console.log(token)

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    path : '/',
    // domain: '.kit-hardware-center.com', 
    sameSite : 'none',
  };
  user.tokens = null
  user.password = null
  user.resetLink = null
  res.status(statusCode).cookie("access_token", token, options).json({
    success: true,
    user,
    token,
  });
  console.log(1)
};

module.exports = sendToken;
