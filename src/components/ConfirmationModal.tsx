/** @format */

"use client";

import { useState } from "react";
import { formatJobId } from "@/lib/utils/jobUtils";
import { useTheme } from "@/lib/business";

interface ConfirmationModalProps {
  isOpen: boolean;
  jobId: string;
  displayJobId?: string | null;
  onClose: () => void;
  onViewSummary: () => void;
}

export default function ConfirmationModal({
  isOpen,
  jobId,
  displayJobId,
  onClose,
  onViewSummary,
}: ConfirmationModalProps) {
  const [copied, setCopied] = useState(false);
  const { theme, styles } = useTheme();

  if (!isOpen) return null;

  const formattedJobId = formatJobId(jobId, displayJobId);

  const handleCopyJobId = async () => {
    try {
      await navigator.clipboard.writeText(formattedJobId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = formattedJobId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Success Header */}
        <div className="px-6 py-8 text-center" style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryHover})` }}>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10"
              style={styles.primaryText}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Job Submitted Successfully!
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Your booking request has been received
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Job Reference */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              Your Job Reference
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900 font-mono">
                {formattedJobId}
              </span>
              <button
                onClick={handleCopyJobId}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
                style={styles.primaryText}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onViewSummary}
              className="w-full py-3 px-4 text-white font-semibold rounded-xl transition-colors shadow-lg hover:opacity-90"
              style={{ ...styles.primaryButton, boxShadow: `0 10px 15px -3px ${theme.primary}40` }}
            >
              View Booking Summary
            </button>
            <p className="text-xs text-center mt-1" style={styles.primaryText}>
              <span className="inline-block">↑</span> Note: View the report that will be sent to your business over Email or WhatsApp
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <p className="text-sm text-gray-600 text-center">
              Our team will review your request and contact you shortly to confirm the details and finalize your booking.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Please save your job reference number for future inquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
