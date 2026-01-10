/** @format */

"use client";

import { useState, ReactNode } from "react";

interface MobileBottomSheetProps {
  children: ReactNode;
  peekContent: ReactNode;
  title?: string;
}

export default function MobileBottomSheet({
  children,
  peekContent,
  title = "Quote Summary",
}: MobileBottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-50
          bg-white rounded-t-2xl shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isExpanded ? "translate-y-0" : "translate-y-[calc(100%-72px)]"}
        `}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center py-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Peek bar (always visible) */}
        <div
          className="px-4 pb-3 flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">{peekContent}</div>
          <svg
            className={`w-5 h-5 text-gray-500 ml-2 transform transition-transform duration-300 ${
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
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>

        {/* Full content (visible when expanded) */}
        <div
          className={`overflow-y-auto transition-all duration-300 ${
            isExpanded ? "max-h-[65vh]" : "max-h-0"
          }`}
        >
          <div className="px-4 pb-6 border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
            {children}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind sheet */}
      <div className="md:hidden h-20" />
    </>
  );
}
