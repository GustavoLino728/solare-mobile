"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

type FiltersProps = {
  categories?: string[];
  labels?: Record<string, string>;
  active?: string;
  onChange?: (category: string) => void;
  className?: string;
  showAll?: boolean;
};

const DEFAULT_CATEGORIES = [
  "anel",
  "bracelete",
  "brincos",
  "colar",
  "pulseira",
  "tornozeleira",
];

export default function Filters({
  categories = DEFAULT_CATEGORIES,
  labels = {},
  active,
  onChange,
  className,
  showAll = true,
}: FiltersProps) {
  const [internalActive, setInternalActive] = useState<string>("todos");

  useEffect(() => {
    if (typeof active !== "undefined") {
      setInternalActive(active);
    }
  }, [active]);

  const currentActive = typeof active !== "undefined" ? active : internalActive;

  function handleSelect(category: string) {
    const newValue = currentActive === category ? "todos" : category;

    if (onChange) {
      onChange(newValue);
    } else {
      setInternalActive(newValue);
    }
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className={clsx("flex flex-wrap gap-2 items-center", className)}>
      {showAll && (
        <button
          type="button"
          aria-pressed={currentActive === "todos"}
          onClick={() => handleSelect("todos")}
          className={clsx(
            "px-3 py-1 rounded-lg text-sm font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-1",
            currentActive === "todos"
              ? "bg-slate-900 text-white shadow"
              : "bg-white/80 text-slate-700 hover:shadow-sm"
          )}
        >
          All
        </button>
      )}

      {categories.map((cat) => {
        const label = labels[cat] ?? cat;
        const isActive = currentActive === cat;

        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleSelect(cat)}
            className={clsx(
              "px-3 py-1 rounded-lg text-sm font-medium transition-transform transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-1",
              isActive
                ? "bg-slate-900 text-white shadow"
                : "bg-white/80 text-slate-700 hover:-translate-y-0.5"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}