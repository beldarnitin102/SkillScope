const express = require("express")
const authmiddleware = require("../middleware/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const uplod = require("../middleware/file.middleware")

const interviewRouter = express.Router()

interviewRouter.post("/", authmiddleware.authUser, uplod.single("resume"),interviewController.generateInterviewReportController)


module.exports = interviewRouter