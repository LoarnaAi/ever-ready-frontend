/** @format */

"use client";

import { useState, ReactNode } from "react";

interface MobileJobDetailsAccordionProps {
  children: ReactNode;
  title: string;
}

export default function MobileJobDetailsAccordion({
  children,
  title,
}: MobileJobDetailsAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="md:hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-left transition-all hover:bg-orange-100"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expandable content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg px-4 py-4 -mt-1">
          {children}
        </div>
      </div>
    </div>
  );
}
