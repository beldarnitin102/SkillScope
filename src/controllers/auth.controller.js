const userModel  = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function registerUserController(req,res) {
  const {username,email,password } = req.body

  if (!username || !email|| !password  ){
    return res.status(400).json({
      message : "please provide username,email and password"
    })
  }
  const isUserAlreadyExists = await userModel.findOne({
    $or : [{username}, {email}]
  })

  if(isUserAlreadyExists) {
    return res.status(400).json({
      message : "account alreadt exists with email or username"
    })
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    username,
    email,
    password: hash
  })

  const token = jwt.sign(
    {id:user._id,
    username: user.username}
    
    ,process.env.JWT_SECRET,
    {expiresIn: "1d"}
  )

  res.cookie("token", token)

  res.status(201).json({
    message : "user register successfully",
    user : {
      id: user._id,
      email: user.email,
      username: user.username

    }
  })
}


module.exports = {registerUserController}




