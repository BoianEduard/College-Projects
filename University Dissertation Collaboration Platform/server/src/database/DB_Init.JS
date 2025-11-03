const mysql = require("mysql2/promise");
const env = require("dotenv");

env.config();

async function Create_DB() {
  let conn;
  try {
    // Crează conexiunea
    conn = await mysql.createConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Crează baza de date dacă nu există
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await conn.query(`USE ${process.env.DB_NAME}`);

    console.log("Baza de date a fost creată");

    // Crează tabelele
    await createTables(conn);
  } catch (err) {
    console.error("Eroare la crearea bazei de date:", err.stack);
  } finally {
    if (conn) await conn.end();
  }
}

async function createTables(conn) {
  // Exemplu de creare tabel pentru studenți
  const createStudentsTableQuery = `
    CREATE TABLE IF NOT EXISTS student (
      id VARCHAR(255) PRIMARY KEY,
      nume_complet VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      imagine_profil VARCHAR(255),
      serie VARCHAR(255),
      grupa VARCHAR(255),
      specializare VARCHAR(255),
      token_acces VARCHAR(255),
      id_lucrare INT,
      INDEX(id_lucrare)
    );
  `;

  const createProfesoriTableQuery = `
    CREATE TABLE IF NOT EXISTS profesor (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nume_complet VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        imagine_profil VARCHAR(255),
        perioada_start DATETIME,
        perioada_final DATETIME,
        nr_elevi INT DEFAULT 0
    );
  `;

  const createLucrareTableQuery = `
  CREATE TABLE IF NOT EXISTS lucrare (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titlu_lucrare VARCHAR(255),
    data_incarcare TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stare enum('In evaluare','Aprobată','Respinsă', 'Neîncărcată',"Semnata"),
    fisier VARCHAR(255),
    id_student VARCHAR(255),
    id_profesor VARCHAR(255),
    INDEX (id_student),
    INDEX(id_profesor)
  );
  `;
  try {
    await conn.query(createStudentsTableQuery);
    console.log("Tabela 'student' a fost creata.");
    await conn.query(createProfesoriTableQuery);
    console.log("Tabela 'profesor' a fost creata");
    await conn.query(createLucrareTableQuery);
    console.log("Tabela 'lucrare' a fost creata");
  } catch (error) {
    console.error("Eroare la crearea tabelului 'students':", error);
  }

  // Adaugă aici alte tabele după modelul de mai sus
}

function DB_Init() {
  Create_DB();
  console.log("Inițializarea bazei de date a fost completată.");
}

module.exports = DB_Init;
