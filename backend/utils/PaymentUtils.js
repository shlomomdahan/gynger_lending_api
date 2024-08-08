import { pool } from "../db.js";
import { default as axios } from "axios";
import getAuthToken from "./authToken.js";

const API_URL = "https://unreliable-payments-wappznbt3q-uc.a.run.app";

function generateRefID(loanID, amount) {
  return `ref-${loanID}-${amount}-${Date.now()}`;
}

async function getPendingPayments() {
  try {
    const pendingPayments = await pool.query(
      "SELECT * FROM payments WHERE status = $1 OR status = $2",
      ["Created", "Pending"]
    );

    for (const payment of pendingPayments.rows) {
      await updatePaymentStatus(
        payment.external_payment_id,
        payment.loan_id,
        payment.amount
      );
    }
  } catch (error) {
    console.error("Error checking pending payments:", error);
  }
}

async function updatePaymentStatus(referenceId, loanID, amount) {
  try {
    const authToken = await getAuthToken();
    const response = await axios.get(`${API_URL}/payments`, {
      params: { authToken, referenceId },
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.result && response.data.result.length > 0) {
      const payment = response.data.result[0];
      const newStatus = payment.status;

      const currStatus = await pool.query(
        "SELECT status FROM payments WHERE external_payment_id = $1",
        [referenceId]
      );

      // Only update if status has changed
      if (currStatus.rows[0].status !== newStatus) {
        await pool.query(
          "UPDATE payments SET status = $1 WHERE external_payment_id = $2",
          [newStatus, referenceId]
        );

        console.log(`Payment ${referenceId} status updated to ${newStatus}`);

        if (newStatus === "Successful") {
          await updateLoanBalance(loanID, amount);
        }
      }
    }
  } catch (error) {
    console.error(`Error updating payment status for ${referenceId}:`, error);
  }
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

export {
  generateRefID,
  getPendingPayments,
  updatePaymentStatus,
  updateLoanBalance,
};
