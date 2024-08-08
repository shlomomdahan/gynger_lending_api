import { Router } from "express";
import { pool } from "../db.js";
import { validateSigner, validationResult } from "../utils/validators.js";

const router = Router();

router.post("/", validateSigner, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  const { firstName, lastName, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO signers (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *",
      [firstName, lastName, email]
    );

    console.log(`Signer ${firstName} ${lastName} created.`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      //error code for duplicate emails as sql schema enforce unique email
      res
        .status(409)
        .json({ error: "Email already exists. Please use a different email." });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while creating the signer." });
    }
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

export default router;
