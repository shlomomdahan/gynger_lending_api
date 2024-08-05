// components/SignersTable.tsx
import React from "react";

type Signer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type SignersTableProps = {
  signers: Signer[];
};

const SignersTable: React.FC<SignersTableProps> = ({ signers }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Signers
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              First Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Last Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              Email
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {signers.map((signer) => (
            <tr key={signer.id}>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                {signer.id}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {signer.first_name}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {signer.last_name}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {signer.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignersTable;
