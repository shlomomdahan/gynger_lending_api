const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.post("/", async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO signers (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *",
      [firstName, lastName, email]
    );

    console.log(`Signer ${firstName} ${lastName} created.`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the signer." });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM signers");
    res.json(result.rows);
  } catch (error) {
    console.log("Error fetching signers");
    res.status(500).json({ error: "Error fetching signers" });
  }
});

module.exports = router;
