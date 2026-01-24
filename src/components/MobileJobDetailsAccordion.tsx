/** @format */

"use client";

import { useState, ReactNode } from "react";
import { useTheme } from "@/lib/business";
import BusinessLogo from "@/components/BusinessLogo";

interface MobileJobDetailsAccordionProps {
  children: ReactNode;
  title: string;
}

export default function MobileJobDetailsAccordion({
  children,
  title,
}: MobileJobDetailsAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="md:hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-left transition-all"
        style={{
          backgroundColor: theme.primaryLight,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme.primaryBorder,
        }}
      >
        <div className="flex items-center gap-3">
          <BusinessLogo variant="square" width={28} height={28} />
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
