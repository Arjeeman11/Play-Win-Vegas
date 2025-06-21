import * as React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${className}`}
      {...props}
    />
  );
}
