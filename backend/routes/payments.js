import { Router } from "express";
import { pool } from "../db.js";
import { validatePayment, validationResult } from "../utils/validators.js";
import { generateRefID, getPendingPayments } from "../utils/PaymentUtils.js";
import getAuthToken from "../utils/authToken.js";
import { default as axios } from "axios";

const router = Router();

const API_URL = "https://unreliable-payments-wappznbt3q-uc.a.run.app";

router.post("/", validatePayment, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  const { amount, loanID, cardNumber, cardExpMonth, cardExpYear, note } =
    req.body;
  const referenceId = generateRefID(loanID, amount);

  try {
    await pool.query("BEGIN");

    await pool.query(
      "INSERT INTO payments (amount, loan_id, status, external_payment_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [amount, loanID, "Created", referenceId]
    );

    const authToken = await getAuthToken();
    const paymentPayload = {
      referenceId,
      amount: amount * 100,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      note,
      processAt: "now",
    };

    const APIResponse = await axios.post(
      `${API_URL}/payments`,
      paymentPayload,
      {
        params: { authToken: authToken },
        headers: { "Content-Type": "application/json" },
      }
    );

    await pool.query("COMMIT");

    res.status(202).json(APIResponse.data);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

// Set interval to check pending payments every 10 seconds
setInterval(getPendingPayments, 10000);

// Get all payments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payments");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching payments." });
  }
});

export default router;
