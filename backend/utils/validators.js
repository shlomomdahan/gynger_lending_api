import { body, query, validationResult } from "express-validator";

const validateSigner = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
];

const validateLoan = [
  body("principalAmount")
    .notEmpty()
    .withMessage("Principal amount is required")
    .isNumeric()
    .withMessage("Principal amount must be a number"),
  body("feeAmount")
    .notEmpty()
    .withMessage("Fee amount is required")
    .isNumeric()
    .withMessage("Fee amount must be a number"),
  body("signerIds")
    .notEmpty()
    .withMessage("Signer IDs are required")
    .isArray()
    .withMessage("Signer IDs must be an array"),
];

const validateLoanGet = [
  query("loanID").optional().isInt().withMessage("Loan ID must be an integer"),
];

const validatePayment = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
  body("loanID")
    .notEmpty()
    .withMessage("Loan ID is required")
    .isInt()
    .withMessage("Loan ID must be an integer"),
  body("cardNumber")
    .notEmpty()
    .withMessage("Card number is required")
    .isLength({ min: 16, max: 16 })
    .withMessage("Must be a valid credit card number"),
  body("cardExpMonth")
    .notEmpty()
    .withMessage("Card expiration month is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("Must be a valid month"),
  body("cardExpYear")
    .notEmpty()
    .withMessage("Card expiration year is required")
    .isInt({ min: new Date().getFullYear() })
    .withMessage("Card expiration year must be in the future"),
  body("note").optional(),
];

export {
  validateSigner,
  validateLoan,
  validateLoanGet,
  validatePayment,
  validationResult,
};
