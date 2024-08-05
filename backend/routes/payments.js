const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { default: axios } = require("axios");

const API_URL = "https://unreliable-payments-wappznbt3q-uc.a.run.app";
let AUTH_TOKEN = null;

async function getAuthToken() {
  if (!AUTH_TOKEN) {
    try {
      const response = await axios.post(`${API_URL}/auth-tokens`, {
        headers: { "Content-Type": "application/json" },
      });
      AUTH_TOKEN = response.data.token;
      console.log("New auth token generated:", AUTH_TOKEN);
    } catch (error) {
      console.error("Error generating auth token:", error);
      throw error;
    }
  }
  return AUTH_TOKEN;
}

function generateRefID(loanID, amount) {
  return `ref-${loanID}-${amount}-${Date.now()}`;
}

router.post("/", async (req, res) => {
  const { amount, loanID, cardNumber, cardExpMonth, cardExpYear, note } =
    req.body;
  const referenceId = generateRefID(loanID, amount);

  try {
    await pool.query("BEGIN");

    const dbPaymentResult = await pool.query(
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
        params: {
          authToken: authToken,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await pool.query("COMMIT");

    updatePaymentStatus(referenceId, loanID, amount);

    res.status(202).json(APIResponse.data);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

async function updatePaymentStatus(referenceId, loanID, amount) {
  const checkStatus = async () => {
    try {
      const authToken = await getAuthToken();
      const response = await axios.get(`${API_URL}/payments`, {
        params: { authToken, referenceId },
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.result && response.data.result.length > 0) {
        const payment = response.data.result[0];
        const newStatus = payment.status;

        await pool.query(
          "UPDATE payments SET status = $1 WHERE external_payment_id = $2",
          [newStatus, referenceId]
        );

        console.log(`Payment ${referenceId} status updated to ${newStatus}`);

        if (newStatus === "Successful" || newStatus === "Failed") {
          clearInterval(intervalId);
          console.log(`Stopped checking status for payment ${referenceId}`);

          // If payment is successful, update the loan balance
          if (newStatus === "Successful") {
            await updateLoanBalance(loanID, amount);
          }
        }
      }
    } catch (error) {
      console.error(`Error updating payment status for ${referenceId}:`, error);
    }
  };

  checkStatus();
  const intervalId = setInterval(checkStatus, 35000);
}

async function updateLoanBalance(loanID, amount) {
  try {
    const loanResult = await pool.query(
      "UPDATE loans SET outstanding_balance = outstanding_balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING outstanding_balance",
      [amount, loanID]
    );

    console.log(`Loan ${loanID} balance updated`);

    const outstandingBalance = loanResult.rows[0].outstanding_balance;

    if (outstandingBalance <= 0) {
      await pool.query(
        "UPDATE loans SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        [loanID]
      );
      console.log(`Loan ${loanID} fully paid off`);
    }
  } catch (error) {
    console.error(`Error updating loan balance for loan ${loanID}:`, error);
  }
}

//get all payments
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

module.exports = router;
