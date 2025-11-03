// professorRoutes.js
const express = require("express");
const router = express.Router();
const {
  updateProfessorDetails,
  getAllProfessors,
  getProfessorById,
  deleteProfessor,
  updateIntervalsProfessor,
  getProfessorID,
  getIntervalsProf,
  updateNrElevi,
  getProfessorNameById,
} = require("../controllers/profesorController");

const authMiddleware = require("../middleware/auth");

router.get("/getAllProf", getAllProfessors); // Only one route for getting all professors
router.get("/getProf/:id", getProfessorById); // Only one route for getting a professor by ID
router.put("/:id", authMiddleware, updateProfessorDetails);
router.delete("/:id", authMiddleware, deleteProfessor);
router.put("/putIntervalsProf/:id", updateIntervalsProfessor);
router.put("/updateNrElevi/:id", updateNrElevi);
router.get("/getProfessorID/:email", getProfessorID);
router.get("/getIntervalsProf/:email", getIntervalsProf);
router.get("/getProfessorNameById/:id", getProfessorNameById);

module.exports = router;
