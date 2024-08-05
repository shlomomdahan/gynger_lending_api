import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

type LoanFormFields = {
  principalAmount: string;
  feeAmount: string;
  signer_ids: string;
};

type LoanFormProps = {
  onSubmitSuccess: () => void;
};

export default function LoanForm({ onSubmitSuccess }: LoanFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoanFormFields>();

  const LoanSubmit: SubmitHandler<LoanFormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const signer_ids = data.signer_ids
        .split(",")
        .map((id) => parseInt(id.trim(), 10));

      const loanData = {
        principalAmount: parseFloat(data.principalAmount),
        feeAmount: parseFloat(data.feeAmount),
        signerIds: signer_ids,
      };

      const response = await axios.post(
        "http://localhost:3000/loans",
        loanData
      );
      console.log("Loan submitted:", response.data);
      onSubmitSuccess();
      reset();
    } catch (error) {
      console.error("Error submitting loan:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(LoanSubmit)}
      className="flex flex-col space-y-4"
    >
      <input
        {...register("principalAmount", { required: true, min: 0 })}
        type="text"
        placeholder="Principal Amount"
        className="p-2 rounded text-black"
      />
      <input
        {...register("feeAmount", { required: true, min: 0 })}
        type="text"
        placeholder="Fee Amount"
        className="p-2 rounded text-black"
      />
      <input
        {...register("signer_ids", { required: true })}
        type="text"
        placeholder="Signer IDs (comma-separated)"
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
