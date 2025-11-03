// professorController.js
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Helper function for standardized response format
const createResponse = (success, message, data = null, error = null) => ({
  success,
  message,
  data,
  ...(error && {
    error:
      process.env.NODE_ENV === "development" ? error : "Internal server error",
  }),
});

// Validation helper
const validateProfessorData = (data) => {
  const { id, full_name, email } = data;
  if (!id || !full_name || !email) {
    throw new Error("Missing required fields: id, full_name, email");
  }
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }
};

/**
 * Add new professor after OAuth authentication
 */
const addProfessorOAUTH = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const token = req.body.token;

    if (!token) {
      return res
        .status(400)
        .json(createResponse(false, "Token is required", null));
    }

    // Decode the token to extract user information
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(400).json(createResponse(false, "Invalid token", null));
    }

    // Extract user data from the decoded token
    const {
      sub: id,
      name: full_name,
      email,
      picture: profile_picture,
    } = decoded;
    console.log(decoded);

    // Validate input data
    validateProfessorData({ id, full_name, email });

    await conn.beginTransaction();

    // Check if professor already exists
    const [existing] = await conn.execute(
      "SELECT id FROM profesor WHERE id = ? OR email = ?",
      [id, email]
    );

    if (existing.length > 0) {
      await conn.commit();
      return res
        .status(200)
        .json(createResponse(true, "Professor already exists", existing[0]));
    }

    // Insert new professor
    const [result] = await conn.execute(
      `INSERT INTO profesor (nume_complet, email, imagine_profil)
            VALUES (?, ?, ?)`,
      [full_name, email, profile_picture]
    );

    await conn.commit();

    res.status(201).json(
      createResponse(true, "Professor added successfully", {
        professorId: id,
        full_name,
        email,
      })
    );
  } catch (err) {
    await conn.rollback();
    console.error("Error in addProfessorOAUTH:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error adding professor after authentication",
          null,
          err.message
        )
      );
  } finally {
    conn.release();
  }
};

const updateIntervalsProfessor = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params; // ID-ul profesorului
    console.log("IDPROFESOR INTERVALE", id);
    const { intervalStart, intervalEnd } = req.body; // Intervalele primite din frontend

    // Validăm că intervalele sunt prezente
    if (!intervalStart || !intervalEnd) {
      throw new Error("Missing required interval fields");
    }

    await conn.beginTransaction();

    // Actualizăm intervalele în baza de date
    const [result] = await conn.execute(
      `UPDATE profesor
         SET perioada_start = ?, perioada_final = ?
         WHERE id = ?`,
      [intervalStart, intervalEnd, id]
    );

    // Verificăm dacă profesorul a fost găsit
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json(createResponse(false, "Professor not found"));
    }

    await conn.commit();

    // Răspuns de succes
    res.status(200).json(
      createResponse(true, "Professor intervals updated successfully", {
        id,
        intervalStart,
        intervalEnd,
      })
    );
  } catch (err) {
    await conn.rollback();
    console.error("Error in updateIntervalsProfessor:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error updating professor intervals",
          null,
          err.message
        )
      );
  } finally {
    conn.release();
  }
};

/**
 * Actualizare detalii profesor
 */
const updateProfessorDetails = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    const { perioada_start, perioada_final, nr_elevi } = req.body;

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `UPDATE profesor 
            SET perioada_start = ?, perioada_final = ?, nr_elevi = ?, data_actualizare = NOW()
            WHERE id = ?`,
      [perioada_start, perioada_final, nr_elevi, id]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json(createResponse(false, "Professor not found"));
    }

    await conn.commit();

    res.status(200).json(
      createResponse(true, "Professor details updated successfully", {
        id,
        perioada_start,
        perioada_final,
        nr_elevi,
      })
    );
  } catch (err) {
    await conn.rollback();
    console.error("Error in updateProfessorDetails:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error updating professor details",
          null,
          err.message
        )
      );
  } finally {
    conn.release();
  }
};

/**
 * Obținere toți profesorii
 */
const getAllProfessors = async (req, res) => {
  try {
    const [results] = await pool.execute(
      `SELECT 
                id, nume_complet, email, imagine_profil, 
                perioada_start, perioada_final, nr_elevi
            FROM profesor`
    );

    res
      .status(200)
      .json(createResponse(true, "Professors retrieved successfully", results));
  } catch (err) {
    console.error("Error in getAllProfessors:", err);
    res
      .status(500)
      .json(
        createResponse(false, "Error retrieving professors", null, err.message)
      );
  }
};

/**
 * Obținere profesor după ID
 */
const getProfessorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await pool.execute(
      `SELECT 
                id, nume_complet, email, imagine_profil,
                perioada_start, perioada_final, nr_elevi,
                data_creare, data_actualizare
            FROM profesor 
            WHERE id = ?`,
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json(createResponse(false, "Professor not found"));
    }

    res
      .status(200)
      .json(
        createResponse(true, "Professor retrieved successfully", results[0])
      );
  } catch (err) {
    console.error("Error in getProfessorById:", err);
    res
      .status(500)
      .json(
        createResponse(false, "Error retrieving professor", null, err.message)
      );
  }
};

/**
 * Ștergere profesor
 */
const deleteProfessor = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;

    await conn.beginTransaction();

    // Verificare dacă profesorul are studenți asociați
    const [students] = await conn.execute(
      "SELECT COUNT(*) as count FROM student WHERE id_profesor = ?",
      [id]
    );

    if (students[0].count > 0) {
      await conn.rollback();
      return res
        .status(400)
        .json(
          createResponse(
            false,
            "Cannot delete professor with associated students"
          )
        );
    }

    const [result] = await conn.execute("DELETE FROM profesor WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json(createResponse(false, "Professor not found"));
    }

    await conn.commit();

    res
      .status(200)
      .json(createResponse(true, "Professor deleted successfully"));
  } catch (err) {
    await conn.rollback();
    console.error("Error in deleteProfessor:", err);
    res
      .status(500)
      .json(
        createResponse(false, "Error deleting professor", null, err.message)
      );
  } finally {
    conn.release();
  }
};

const getProfessorID = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { email } = req.params;

    const decodedEmail = decodeURIComponent(email);

    const [rows] = await conn.execute(
      "SELECT id FROM profesor WHERE email = ?",
      [decodedEmail]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Professor not found" });
    }

    res.status(200).json({ success: true, professorID: rows[0].id });
  } catch (err) {
    console.error("Error retrieving professor ID:", err);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving professor ID" });
  } finally {
    conn.release();
  }
};

const getIntervalsProf = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { email } = req.params;
    console.log("Received email:", email);
    // Continuă cu logica ta

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not provided",
      });
    }

    const [rows] = await conn.execute(
      "SELECT perioada_start, perioada_final FROM profesor WHERE email = ?",
      [email || null] // Asigură-te că email-ul nu este undefined
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No intervals found",
        intervals: { intervalStart: null, intervalEnd: null },
      });
    }

    res.status(200).json({
      success: true,
      intervals: {
        intervalStart: rows[0].perioada_start || null,
        intervalEnd: rows[0].perioada_final || null,
      },
    });
  } catch (err) {
    console.error("Error retrieving professor intervals:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving professor intervals",
    });
  } finally {
    conn.release();
  }
};

const updateNrElevi = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    console.log("id ul este acesta " + id);
    const { nr_elevi } = req.body;
    console.log("acesta este nr elevi " + nr_elevi);

    // Validare input
    if (nr_elevi === undefined) {
      return res.status(400).json({
        success: false,
        message: "Number of students is required",
        data: null,
      });
    }

    // Verificăm dacă profesorul există
    const [profExists] = await conn.execute(
      "SELECT id FROM profesor WHERE id = ?",
      [id]
    );

    if (profExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No professor found with ID: ${id}`,
        data: null,
      });
    }

    // Update simplu al numărului de elevi
    const [result] = await conn.execute(
      "UPDATE profesor SET nr_elevi = ? WHERE id = ?",
      [nr_elevi, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to update number of students",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Number of students updated successfully",
      data: {
        professorId: id,
        updatedStudentCount: nr_elevi,
      },
    });
  } catch (error) {
    console.error("Error in updateNrElevi:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating number of students",
      error: error.message,
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const getProfessorNameById = async (req, res) => {
  const { id } = req.params;
  console.log("FOR THESES STATUS STEP " + id);

  try {
    const [profesor] = await pool.execute(
      "SELECT nume_complet FROM profesor WHERE id = ?",
      [id]
    );

    // Pentru cont nou, returnăm un răspuns de succes cu titlu null
    if (profesor.length === 0) {
      return res.status(200).json({
        success: true,
        profesor: { nume_complet: null },
      });
    }

    res.status(200).json({
      success: true,
      profesor: profesor[profesor.length - 1],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching theses for student",
      error: err.message,
    });
  }
};

module.exports = {
  addProfessorOAUTH,
  updateProfessorDetails,
  getAllProfessors,
  getProfessorById,
  deleteProfessor,
  updateIntervalsProfessor,
  getProfessorID,
  getIntervalsProf,
  updateNrElevi,
  getProfessorNameById,
};
