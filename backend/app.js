import express, { json } from "express";
import cors from "cors";
import { verifyConnection } from "./db.js";
import signersRoutes from "./routes/signers.js";
import loansRoutes from "./routes/loans.js";
import paymentsRoutes from "./routes/payments.js";
import deleteRoutes from "./routes/clear.js";

const port = 3000;
const app = express();

app.use(cors());
app.use(json());

app.use("/signers", signersRoutes);
app.use("/loans", loansRoutes);
app.use("/payments", paymentsRoutes);
app.use("/clear", deleteRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Gynger Lending API" });
});

const startServer = async () => {
  await verifyConnection();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
