const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const mockAPI = require("../mockUnreliablePaymentsAPI");

function generateRefID(loanID, amount) {
  return `ref-${loanID}-${amount}-${Date.now()}`;
}

async function updatePaymentStatus(referenceId, loanID, amount) {
  try {
    // Wait for 11 seconds to ensure the mock API has completed its status changes
    await new Promise((resolve) => setTimeout(resolve, 11000));

    const authToken = mockAPI.createAuthToken().token;
    const payment = await mockAPI.getPayment(referenceId, authToken);

    console.log("Payment status:", payment.result.status);

    await pool.query("BEGIN");

    // Update payment status in database
    await pool.query(
      "UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE external_payment_id = $2",
      [payment.result.status, referenceId]
    );

    // If payment is successful, update the loan
    if (payment.result.status === "Successful") {
      // Update outstanding balance and check if loan is fully paid off
      const loanResult = await pool.query(
        "UPDATE loans SET outstanding_balance = outstanding_balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING outstanding_balance",
        [amount, loanID]
      );

      const outstandingBalance = loanResult.rows[0].outstanding_balance;

      if (outstandingBalance <= 0) {
        await pool.query(
          "UPDATE loans SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
          [loanID]
        );
      }
    }

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error updating payment status:", error);
  }
}

router.post("/", async (req, res) => {
  const { amount, loanID, cardNumber, cardExpMonth, cardExpYear, note } =
    req.body;
  const referenceId = generateRefID(loanID, amount);

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Create payment record in your database
    const dbPaymentResult = await pool.query(
      "INSERT INTO payments (amount, loan_id, status, external_payment_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [amount, loanID, "Pending", referenceId]
    );

    // Call mock Unreliable Payments API
    const authToken = mockAPI.createAuthToken().token;
    const paymentPayload = {
      referenceId,
      amount,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      note,
    };

    // send payment to mock API
    // await mockAPI.createPayment(paymentPayload, authToken);
    const mockApiResponse = await mockAPI.createPayment(
      paymentPayload,
      authToken
    );

    if (mockApiResponse.error) {
      // If there's an error, rollback the transaction and return the error
      await pool.query("ROLLBACK");
      return res.status(400).json({ error: mockApiResponse.error });
    }

    await pool.query("COMMIT");

    // Start background process to update payment status
    updatePaymentStatus(referenceId, loanID, amount);

    res.status(202).json({
      id: dbPaymentResult.rows[0].id,
      referenceId: referenceId,
      amount: amount * 100,
      updatedAt: dbPaymentResult.rows[0].updated_at,
      createdAt: dbPaymentResult.rows[0].created_at,
      note: note,
      status: dbPaymentResult.rows[0].status,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

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
