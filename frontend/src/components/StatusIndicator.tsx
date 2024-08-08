import React from "react";
import { ClipLoader } from "react-spinners";
import { FaCheck, FaTimes } from "react-icons/fa";

export type Status = "Created" | "Pending" | "Successful" | "Failed";

type StatusIndicatorProps = {
  status: Status;
};

function StatusIndicator({ status }: StatusIndicatorProps) {
  switch (status) {
    case "Created":
    case "Pending":
      return <ClipLoader color="#d7cc85" size={15} />;
    case "Successful":
      return <FaCheck className="text-green-500 text-xl" />;
    case "Failed":
      return <FaTimes className="text-red-500 text-xl" />;
    default:
      return null;
  }
}

export default StatusIndicator;
