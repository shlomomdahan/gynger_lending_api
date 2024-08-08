import { pool } from "../db.js";
import { default as axios } from "axios";

const API_URL = "https://unreliable-payments-wappznbt3q-uc.a.run.app";

async function getAuthToken() {
  const tokenResult = await pool.query(
    "SELECT token, created_at FROM auth_tokens ORDER BY created_at DESC LIMIT 1"
  );

  if (tokenResult.rows.length > 0) {
    const { token, created_at } = tokenResult.rows[0];
    const tokenAge = (new Date() - new Date(created_at)) / 1000;

    // Assume the token is valid for 24 hours
    if (tokenAge < 24 * 60 * 60) {
      return token;
    }
  }

  // if not found or expired, generate a new token
  try {
    const response = await axios.post(`${API_URL}/auth-tokens`, {
      headers: { "Content-Type": "application/json" },
    });
    const newToken = response.data.token;

    await pool.query("INSERT INTO auth_tokens (token) VALUES ($1)", [newToken]);

    console.log("New auth token generated:", newToken);
    return newToken;
  } catch (error) {
    console.error("Error generating auth token:", error);
    throw error;
  }
}

export default getAuthToken;
