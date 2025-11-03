const express = require("express");
const router = express.Router();
const {
  addStudentOAUTH,
  updateStudentDetails,
  updateStudentProfile,
  getStudentByThesis,
  getStudentThesis,
  getStudentInfo, // Make sure this is defined in your controller
  getFullStudentByThesis,
} = require("../controllers/studentController");

// Route for adding a new student (after OAuth authentication)
router.post("/oauth", addStudentOAUTH);

// Route for updating student details
router.put("/updateInfo/:id", updateStudentDetails);

// Route for updating student profile
router.put("/updateProfile/:id", updateStudentProfile);

// Route for retrieving student thesis information by student ID
router.get("/:id/thesis", getStudentThesis);

// Route for getting student details by thesis ID
router.get("/getStudentByThesis/:id", getStudentByThesis);

// Route for retrieving student information
router.get("/getStudentInfo/:id", getStudentInfo);
router.get("/getFullStudentByThesis/:id", getFullStudentByThesis);

module.exports = router;
