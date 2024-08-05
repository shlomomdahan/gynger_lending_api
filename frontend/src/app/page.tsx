// pages/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SignerForm from "../components/SignerForm";
import SignersTable from "../components/SignersTable";
import LoanForm from "../components/LoanForm";
import LoansTable from "../components/LoansTable";
import PaymentForm from "../components/PaymentForm";
import PaymentsTable from "../components/PaymentsTable";

type Signer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type Loan = {
  id: number;
  principal_amount: number;
  fee_amount: number;
  outstanding_balance: number;
  signer_ids: number[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

type Payment = {
  id: number;
  amount: number;
  loan_id: number;
  status: string;
  external_payment_id: string;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetchSigners();
    fetchLoans();
    fetchPayments();
  }, []);

  const fetchSigners = async () => {
    try {
      const response = await axios.get<Signer[]>(
        "http://localhost:3000/signers"
      );
      setSigners(response.data);
    } catch (error) {
      console.error("Error fetching signers:", error);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get<Loan[]>("http://localhost:3000/loans");
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get<Payment[]>(
        "http://localhost:3000/payments"
      );
      setPayments(response.data);
      setTimeout(async () => {
        const refreshedResponse = await axios.get<Payment[]>(
          "http://localhost:3000/payments"
        );
        setPayments(refreshedResponse.data);
        fetchLoans();
      }, 11000);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Gynger Lending API
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-300 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-black text-center">
              Add Signer
            </h2>
            <SignerForm onSubmitSuccess={fetchSigners} />
          </div>
          <div className="bg-gray-300 shadow rounded-lg p-6">
            {/* Placeholder for loan form */}
            <h2 className="text-lg font-semibold mb-4 text-black text-center">
              Add Loan
            </h2>
            <LoanForm onSubmitSuccess={fetchLoans} />
          </div>
          <div className="bg-gray-300 shadow rounded-lg p-6">
            {/* Placeholder for payment form */}
            <h2 className="text-lg font-semibold mb-4 text-black text-center">
              Make Payment
            </h2>
            <PaymentForm onSubmitSuccess={fetchPayments} />
          </div>
        </div>

        <div className="space-y-8">
          <SignersTable signers={signers} />
          <LoansTable loans={loans} />
          <PaymentsTable payments={payments} />
        </div>
      </main>
    </div>
  );
}
