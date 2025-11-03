// studentController.js
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
const validateStudentData = (data) => {
  const { id, full_name, email } = data;
  if (!id || !full_name || !email) {
    throw new Error("Missing required fields");
  }
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }
};

/**
 * Add new student after OAuth authentication
 */
const addStudentOAUTH = async (req, res) => {
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
    validateStudentData({ id, full_name, email });

    await conn.beginTransaction();

    // Check if student already exists
    const [existing] = await conn.execute(
      "SELECT id FROM student WHERE id = ? OR email = ?",
      [id, email]
    );

    if (existing.length > 0) {
      await conn.commit();
      return res.status(201).json(
        createResponse(true, "Existing student", {
          studentId: id,
          full_name,
          email,
        })
      );
    }

    // Insert new student
    const [result] = await conn.execute(
      `INSERT INTO student (id,nume_complet, email, imagine_profil)
            VALUES (?, ?, ?, ?)`,
      [id, full_name, email, profile_picture]
    );

    await conn.commit();

    res.status(201).json(
      createResponse(true, "Student added successfully", {
        studentId: id,
        full_name,
        email,
      })
    );
  } catch (err) {
    await conn.rollback();
    console.error("Error in addStudentOAUTH:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error adding student after authentication",
          null,
          err.message
        )
      );
  } finally {
    conn.release();
  }
};

/**
 * Update student details
 */
const updateStudentDetails = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    console.log("ID", id);
    const { major, series, cls, lucrare } = req.body; // Changed to match frontend

    if (!series || !cls || !major) {
      throw new Error("Missing required fields");
    }

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `UPDATE student 
       SET serie = ?, grupa = ?, specializare = ?, id_lucrare = ?
       WHERE id = ?`,
      [series, cls, major, lucrare, id]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json(createResponse(false, "Student not found"));
    }

    await conn.commit();

    res.status(200).json(
      createResponse(true, "Student details updated successfully", {
        id,
        series,
        cls,
        major,
      })
    );
  } catch (err) {
    await conn.rollback();
    console.error("Error in updateStudentDetails:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error updating student details",
          null,
          err.message
        )
      );
  } finally {
    conn.release();
  }
};

const updateStudentProfile = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    const { major, series, cls } = req.body; // Changed to match frontend

    if (!series || !cls || !major) {
      throw new Error("Missing required fields");
    }

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `UPDATE student 
       SET serie = ?, grupa = ?, specializare = ?
       WHERE id = ?`,
      [series, cls, major, id]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json(createResponse(false, "Student not found"));
    }

    await conn.commit();

    res.status(200).json(
      createResponse(true, "Student details updated successfully", {
        id,
        series,
        cls,
        major,
      })
    );
  } catch (err) {
    await conn.rollback();
    console.error("Error in updateStudentDetails:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error updating student details",
          null,
          err.message
        )
      );
  } finally {
    conn.release();
  }
};
/**
 * Get student thesis information
 */
const getStudentByThesis = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      `SELECT id, nume_complet FROM student WHERE id_lucrare = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json(createResponse(false, "Student not found"));
    }

    res
      .status(200)
      .json(
        createResponse(true, "Student thesis retrieved successfully", result[0])
      );
  } catch (err) {
    console.error("Error in getStudentThesis:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error fetching student thesis",
          null,
          err.message
        )
      );
  } finally {
    conn.release();
  }
};

const getFullStudentByThesis = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      `SELECT id, nume_complet, serie, grupa, specializare FROM student WHERE id_lucrare = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json(createResponse(false, "Student not found"));
    }

    res
      .status(200)
      .json(
        createResponse(true, "Student thesis retrieved successfully", result[0])
      );
  } catch (err) {
    console.error("Error in getStudentThesis:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error fetching student thesis",
          null,
          err.message
        )
      );
  } finally {
    conn.release();
  }
};

const getStudentThesis = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      `SELECT 
                s.id,
                s.nume_complet,
                l.id AS lucrare_id,
                l.titlu,
                l.descriere,
                l.data_incarcare
            FROM student s
            LEFT JOIN lucrare l ON s.id_lucrare = l.id
            WHERE s.id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json(createResponse(false, "Student not found"));
    }

    res
      .status(200)
      .json(
        createResponse(true, "Student thesis retrieved successfully", result[0])
      );
  } catch (err) {
    console.error("Error in getStudentThesis:", err);
    res
      .status(500)
      .json(
        createResponse(
          false,
          "Error fetching student thesis",
          null,
          err.message
        )
      );
  }
};

/**
 * Check if student exists by email
 */
const checkStudentByEmail = async (email) => {
  try {
    const [result] = await pool.execute(
      "SELECT id, email FROM student WHERE email = ?",
      [email]
    );
    return result.length > 0;
  } catch (err) {
    console.error("Error in checkStudentByEmail:", err);
    throw err;
  }
};

const getStudentInfo = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID not provided",
      });
    }

    const [rows] = await conn.execute(
      "SELECT specializare, serie, grupa FROM student WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No student info found",
        studentInfo: null,
      });
    }

    res.status(200).json({
      success: true,
      studentInfo: {
        specializare: rows[0].specializare,
        serie: rows[0].serie,
        grupa: rows[0].grupa,
      },
    });
  } catch (err) {
    console.error("Error retrieving student info:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving student info",
    });
  } finally {
    conn.release();
  }
};

module.exports = {
  addStudentOAUTH,
  updateStudentDetails,
  updateStudentProfile,
  getStudentThesis,
  getStudentByThesis,
  checkStudentByEmail,
  getStudentInfo,
  getFullStudentByThesis,
};
