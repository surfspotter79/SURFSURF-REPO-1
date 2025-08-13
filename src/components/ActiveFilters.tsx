import React from "react";
import { X } from "lucide-react";

type Filters = {
  location?: string;
  spot?: string;
  dateRange?: string;
  photographer?: string;
};

type Props = {
  filters: Filters;
  onClearKey: (key: keyof Filters) => void;
  onClearAll: () => void;
};

const labelMap: Record<keyof Filters, string> = {
  location: "Location",
  spot: "Spot",
  dateRange: "Date",
  photographer: "Photographer",
};

export default function ActiveFilters({ filters, onClearKey, onClearAll }: Props) {
  const entries = (Object.keys(filters) as (keyof Filters)[])
    .filter((k) => Boolean(filters[k] && String(filters[k]).trim().length));

  if (entries.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-500 mr-1">Active filters:</span>
      {entries.map((key) => (
        <button
          key={key}
          onClick={() => onClearKey(key)}
          className="group inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100 border border-blue-100"
        >
          <span className="font-medium">{labelMap[key]}:</span>
          <span>{String(filters[key])}</span>
          <X className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="ml-2 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}
