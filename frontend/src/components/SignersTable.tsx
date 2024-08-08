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
      <table className="min-w-full">
        <thead className="bg-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Signers
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              First Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Last Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Email
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {signers.map((signer) => (
            <tr key={signer.id}>
              <td className="px-6 py-2 text-sm text-gray-500">{signer.id}</td>
              <td className="px-6 py-2 text-sm text-gray-900">
                {signer.first_name}
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
                {signer.last_name}
              </td>
              <td className="px-6 py-2 text-sm text-gray-900">
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
