import React from "react";

export default function PruebaButton({ children, primary = true, disabled = false, onClick }) {
  return (
    <button
      className={[
        "px-4 py-2 rounded-lg font-semibold transition-shadow focus:outline-none",
        primary
          ? "bg-gradient-to-r from-[#63f183] to-[#6366f1] text-white shadow-md"
          : "bg-gray-200 text-gray-800",
        disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
