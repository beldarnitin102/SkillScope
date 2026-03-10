const moongoose = require("mongoose")

const blacklistTokenSchema = new moongoose.Schema({
  token:{
    type: String,
    required: [true, "token is required to added in the blacklist "]

  }
} ,{
  timestamps:true
})

const tokenBlackListModel = moongoose.model("blacklistTokens", blacklistTokenSchema)

module.exports = tokenBlackListModel