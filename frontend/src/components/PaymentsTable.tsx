import React from "react";
import StatusIndicator from "./StatusIndicator";

type Payment = {
  id: number;
  amount: number;
  loan_id: number;
  status: "Created" | "Pending" | "Successful" | "Failed";
  external_payment_id: string;
  created_at: string;
  updated_at: string;
};

type PaymentsTableProps = {
  payments: Payment[];
};

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Payments
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Loan ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              External Payment ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Updated At
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {payments
            .sort((a, b) => a.id - b.id)
            .map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-2 text-sm text-gray-500">
                  {payment.id}
                </td>
                <td className="px-6 py-2 text-sm text-gray-900">
                  ${payment.amount}
                </td>
                <td className="px-6 py-2 text-sm text-gray-900">
                  {payment.loan_id}
                </td>
                <td className="px-6 py-2 text-sm">
                  <div className="flex flex-row gap-2 align-center">
                    <span
                      className={
                        payment.status === "Created"
                          ? "text-black"
                          : payment.status === "Pending"
                          ? "text-yellow-500"
                          : payment.status === "Successful"
                          ? "text-green-500"
                          : payment.status === "Failed"
                          ? "text-red-500"
                          : "text-gray-500"
                      }
                    >
                      {payment.status}
                    </span>
                    <div className="ml-2">
                      <StatusIndicator status={payment.status} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-2 text-sm text-gray-900">
                  {payment.external_payment_id}
                </td>
                <td className="px-6 py-2 text-sm text-gray-900">
                  {new Date(payment.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-2 text-sm text-gray-900">
                  {new Date(payment.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
