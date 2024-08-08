import { pool } from "../db.js";
import { default as axios } from "axios";

const API_URL = "https://unreliable-payments-wappznbt3q-uc.a.run.app";
let tokenPromise = null;

async function getAuthToken() {
  if (tokenPromise) {
    return tokenPromise;
  }

  tokenPromise = (async () => {
    try {
      const tokenResult = await pool.query(
        "SELECT token FROM auth_tokens ORDER BY created_at DESC LIMIT 1"
      );

      if (tokenResult.rows.length > 0) {
        return tokenResult.rows[0].token;
      }

      // If no token found, generate a new one
      const response = await axios.post(`${API_URL}/auth-tokens`, {
        headers: { "Content-Type": "application/json" },
      });
      const newToken = response.data.token;

      await pool.query("INSERT INTO auth_tokens (token) VALUES ($1)", [
        newToken,
      ]);
      console.log("New auth token generated:", newToken);

      return newToken;
    } catch (error) {
      console.error("Error generating auth token:", error);
      throw error;
    } finally {
      tokenPromise = null;
    }
  })();

  return tokenPromise;
}

export default getAuthToken;
