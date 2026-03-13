const multer = require("multer")

const uplod = multer({
  storage:multer.memoryStorage(),
  limits: {
    fileSize:3 * 1024 * 1024
  }
})

module.exports = uplod