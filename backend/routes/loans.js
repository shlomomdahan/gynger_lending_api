const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.post("/", async (req, res) => {
  const { principalAmount, feeAmount, signerIds } = req.body;

  if (!principalAmount || !feeAmount || !Array.isArray(signerIds)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO loans (principal_amount, fee_amount, outstanding_balance, signer_ids, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [principalAmount, feeAmount, principalAmount + feeAmount, signerIds, true]
    );

    console.log(`Loan created with ID: ${result.rows[0].id}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating loan:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the loan." });
  }
});

router.get("/", async (req, res) => {
  const { loanID } = req.query;

  const query = loanID
    ? "SELECT * FROM loans WHERE id = $1"
    : "SELECT * FROM loans";
  const queryParams = loanID ? [loanID] : [];

  try {
    const result = await pool.query(query, queryParams);

    if (loanID && result.rows.length === 0) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching loan(s):", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching loan(s)." });
  }
});

module.exports = router;
