const express = require("express");
const cors = require("cors");
const app = express();
const { verifyConnection } = require("./db");
const port = 3000;
const signersRoutes = require("./routes/signers");
const loansRoutes = require("./routes/loans");
const paymentsRoutes = require("./routes/payments");

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Update the route paths to include '/api'
app.use("/signers", signersRoutes);
app.use("/loans", loansRoutes);
app.use("/payments", paymentsRoutes);

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
