import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

type SignerFormFields = {
  firstName: string;
  lastName: string;
  email: string;
};

type SignerFormProps = {
  onSubmitSuccess: () => void;
};

export default function SignerForm({ onSubmitSuccess }: SignerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SignerFormFields>();

  const SignerSubmit: SubmitHandler<SignerFormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axios.post("http://localhost:3000/signers", data);
      console.log("Signer submitted:", response.data);
      onSubmitSuccess();
      reset();
    } catch (error) {
      console.error("Error submitting signer:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(SignerSubmit)}
      className="flex flex-col space-y-4"
    >
      <input
        {...register("firstName", { required: true })}
        type="text"
        placeholder="First Name"
        className="p-2 rounded text-black"
      />
      <input
        {...register("lastName", { required: true })}
        type="text"
        placeholder="Last Name"
        className="p-2 rounded text-black"
      />
      <input
        {...register("email", { required: true })}
        type="email"
        placeholder="Email"
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
