// components/LoansTable.tsx
import React from "react";

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

type LoansTableProps = {
  loans: Loan[];
};

const LoansTable: React.FC<LoansTableProps> = ({ loans }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Loans
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Principal Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Fee Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Outstanding Balance
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Signer IDs
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                {loan.id}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                ${loan.principal_amount}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                ${loan.fee_amount}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                ${loan.outstanding_balance}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {loan.signer_ids.join(", ")}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {loan.is_active ? "Active" : "Inactive"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoansTable;
