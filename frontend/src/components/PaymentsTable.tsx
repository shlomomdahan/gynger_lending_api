// components/PaymentsTable.tsx
import React from "react";

type Payment = {
  id: number;
  amount: number;
  loan_id: number;
  status: string;
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Payments
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Loan ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              External Payment ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                {payment.id}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                ${payment.amount}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {payment.loan_id}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {payment.status}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {payment.external_payment_id}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {new Date(payment.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
