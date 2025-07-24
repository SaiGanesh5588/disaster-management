const express = require("express");
const { getVolunteers, addVolunteer } = require("../controllers/volunteerController");
const router = express.Router();

router.get("/", getVolunteers);
router.post("/add", addVolunteer);

module.exports = router;
