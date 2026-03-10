const jwt = require("jsonwebtoken");
const tokenBlacklist = require("../models/blacklist.model");
const tokenBlackListModel = require("../models/blacklist.model");

async function authUser(req,res,next) {
  const token = req.cookies.token

  if(!token){
    return res.status(401).json({
      message: "token is not provide"
    })
  }

  const isTokenBlacklisted = await tokenBlackListModel.findOne({
    token : token
  })

  if(isTokenBlacklisted){
    return res.status(401).json({
      message: "token is invalid"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()

  } catch (error) {
    return res.status(401).json({
      message:"invalid token"
    })
  }
}

module.exports = { authUser }