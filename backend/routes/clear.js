import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.delete("/all", async (req, res) => {
  try {
    await pool.query("BEGIN");

    await pool.query("DELETE FROM payments");
    await pool.query("DELETE FROM loans");
    await pool.query("DELETE FROM signers");

    await pool.query("ALTER SEQUENCE payments_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE loans_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE signers_id_seq RESTART WITH 1");

    await pool.query("COMMIT");

    console.log("All data has been deleted successfully.");
    res.json({ message: "All data has been deleted successfully." });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error deleting all data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting all data." });
  }
});

export default router;
