const express = require("express");
const { updateOtherContent, createInitialContent, getAllUser } = require("../controller/gpt3.controller");

const router = express.Router();

router.get("/getAll", getAllUser)

router.post("/createInitialContent", createInitialContent);
router.put("/updateData/:email", updateOtherContent);


module.exports = router;