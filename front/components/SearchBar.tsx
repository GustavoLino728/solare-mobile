"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import clsx from "clsx";

type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search products...",
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  useEffect(() => {
    if (typeof value !== "undefined") {
      setInternalValue(value);
    }
  }, [value]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (onChange) {
      onChange(val);
    } else {
      setInternalValue(val);
    }
  }

  const currentValue = typeof value !== "undefined" ? value : internalValue;

  return (
    <div
      className={clsx(
        "flex items-center border rounded-lg px-3 py-1 shadow-sm focus-within:ring-2 focus-within:ring-slate-400",
        className
      )}
    >
      <svg
        className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 4.65a7.5 7.5 0 015.999 11.999z"
        />
      </svg>
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 border-none outline-none bg-transparent text-slate-700 placeholder-slate-400"
      />
    </div>
  );
}