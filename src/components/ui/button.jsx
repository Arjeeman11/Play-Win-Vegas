import * as React from "react";

export function Button({ className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-2xl font-bold shadow-md transition transform hover:scale-105 focus:outline-none ${className}`}
      {...props}
    />
  );
}
