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
      <table className="min-w-full">
        <thead className="bg-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Loans
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Principal Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Fee Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Outstanding Balance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Signer IDs
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Status
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
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className="px-6 py-2 text-sm text-gray-500">{loan.id}</td>
              <td className="px-6 py-2 text-sm text-gray-900">
                ${loan.principal_amount}
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
                ${loan.fee_amount}
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
                ${loan.outstanding_balance}
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
                {loan.signer_ids.join(", ")}
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
                <span
                  className={loan.is_active ? "text-green-500" : "text-red-500"}
                >
                  {loan.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
                {new Date(loan.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
                {new Date(loan.updated_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoansTable;
