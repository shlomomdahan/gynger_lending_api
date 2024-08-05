import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

type PaymentFormFields = {
  amount: string;
  loanID: string;
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  note: string;
};

type PaymentFormProps = {
  onSubmitSuccess: () => void;
};

export default function PaymentForm({ onSubmitSuccess }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PaymentFormFields>();

  const PaymentSubmit: SubmitHandler<PaymentFormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const paymentData = {
        amount: parseFloat(data.amount),
        loanID: parseInt(data.loanID, 10),
        cardNumber: data.cardNumber,
        cardExpMonth: parseInt(data.cardExpMonth, 10),
        cardExpYear: parseInt(data.cardExpYear, 10),
        note: data.note,
      };

      const response = await axios.post(
        "http://localhost:3000/payments",
        paymentData
      );
      console.log("Payment submitted:", response.data);
      onSubmitSuccess();
      reset();
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(PaymentSubmit)}
      className="flex flex-col space-y-4"
    >
      <input
        {...register("amount", { required: true, min: 0 })}
        type="text"
        placeholder="Payment Amount"
        className="p-2 rounded text-black"
      />
      <input
        {...register("loanID", { required: true })}
        type="text"
        placeholder="Loan ID"
        className="p-2 rounded text-black"
      />
      <input
        {...register("cardNumber", {
          required: true,
          minLength: 16,
          maxLength: 16,
        })}
        type="text"
        placeholder="Card Number (16 digits)"
        className="p-2 rounded text-black"
      />
      <input
        {...register("cardExpMonth", { required: true, min: 1, max: 12 })}
        type="number"
        placeholder="Card Expiration Month (1-12)"
        className="p-2 rounded text-black"
      />
      <input
        {...register("cardExpYear", {
          required: true,
          min: new Date().getFullYear(),
        })}
        type="number"
        placeholder="Card Expiration Year"
        className="p-2 rounded text-black"
      />
      <textarea
        {...register("note")}
        placeholder="Payment Note"
        className="p-2 rounded text-black"
      />
      <button
        disabled={isSubmitting}
        type="submit"
        className={`p-2 rounded text-white ${
          isSubmitting ? "bg-gray-600" : "bg-green-500"
        }`}
      >
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
