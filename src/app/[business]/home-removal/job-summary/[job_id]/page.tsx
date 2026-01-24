/** @format */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getJobAction } from "@/lib/actions/jobActions";
import { formatJobId } from "@/lib/utils/jobUtils";
import { JobData } from "@/lib/database.types";
import { useBusinessConfig } from "@/lib/business";

export default function JobSummaryPage() {
  const params = useParams();
  const jobId = params.job_id as string;
  const businessSlug = params.business as string;
  const { config, theme } = useBusinessConfig();

  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const primaryTextStyle = { color: theme.primary };
  const primaryBgStyle = { backgroundColor: theme.primary };

  useEffect(() => {
    async function fetchJob() {
      if (jobId) {
        const result = await getJobAction(jobId);
        if (result.success && result.data) {
          setJob(result.data);
        } else {
          setJob(null);
        }
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatCreatedAt = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHomeSizeTitle = (homeSize: string) => {
    const titles: { [key: string]: string } = {
      "1-bedroom": "1 Bedroom Home",
      "2-bedrooms": "2 Bedroom Home",
      "3-bedrooms": "3 Bedroom Home",
      "4-bedrooms": "4 Bedroom Home",
    };
    return titles[homeSize] || homeSize;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: theme.primary, borderTopColor: 'transparent' }}
          ></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-6">
            The job reference you&apos;re looking for doesn&apos;t exist or may have expired.
          </p>
          <Link
            href={`/${businessSlug}/home-removal`}
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors"
            style={primaryBgStyle}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Start New Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-before: always;
          }
          body {
            font-size: 12pt;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Meta Communication Banner */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6 no-print">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-purple-700 italic font-medium">
                See what your business receives. This report will be sent to you on WhatsApp and on Email
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Booking Summary</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                <span className="font-mono font-semibold text-gray-900">{formatJobId(job.job_id, job.display_job_id)}</span>
                <span className="hidden sm:inline">|</span>
                <span>Submitted: {formatCreatedAt(job.created_at)}</span>
              </div>
            </div>
            <div className="flex gap-2 no-print">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                style={primaryBgStyle}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Service Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" style={primaryTextStyle} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L4 9v12h16V9l-8-6zm6 16h-3v-5H9v5H6v-9.5l6-4.5 6 4.5V19z" />
            </svg>
            Service Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Home Size</p>
              <p className="font-semibold text-gray-900">{getHomeSizeTitle(job.homeSize)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Total Items</p>
              <p className="font-semibold text-gray-900">
                {job.furnitureItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </p>
            </div>
          </div>
        </div>

        {/* Furniture List */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" style={primaryTextStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Furniture Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {job.furnitureItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Packing Services */}
        {(job.packingService || job.dismantlePackage || job.packingMaterials.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" style={primaryTextStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Packing Services
            </h2>
            <div className="space-y-3">
              {job.packingService && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">All Inclusive Packing Service</span>
                </div>
              )}
              {job.dismantlePackage && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Dismantle & Reassemble Package</span>
                </div>
              )}
              {job.packingMaterials.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Packing Materials:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {job.packingMaterials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-600">{material.name}</span>
                        <span className="font-medium text-gray-900">x{material.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Addresses */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" style={primaryTextStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Addresses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.collectionAddress && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium uppercase tracking-wide mb-2" style={primaryTextStyle}>Collection From</p>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {job.collectionAddress.address || job.collectionAddress.postcode}
                </p>
                <p className="text-sm text-gray-600">{job.collectionAddress.postcode}</p>
              </div>
            )}
            {job.deliveryAddress && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium uppercase tracking-wide mb-2" style={primaryTextStyle}>Delivery To</p>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {job.deliveryAddress.address || job.deliveryAddress.postcode}
                </p>
                <p className="text-sm text-gray-600">{job.deliveryAddress.postcode}</p>
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" style={primaryTextStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.collectionDate && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium uppercase tracking-wide mb-2" style={primaryTextStyle}>Collection Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(job.collectionDate.date)}</p>
                <p className="text-sm text-gray-600">{job.collectionDate.timeSlot}</p>
              </div>
            )}
            {job.materialsDeliveryDate && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium uppercase tracking-wide mb-2" style={primaryTextStyle}>Materials Delivery</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(job.materialsDeliveryDate.date)}</p>
                <p className="text-sm text-gray-600">{job.materialsDeliveryDate.timeSlot}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" style={primaryTextStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-medium text-gray-900">
                {job.contact.firstName} {job.contact.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-900">{job.contact.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium text-gray-900">
                {job.contact.countryCode} {job.contact.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 no-print">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">What happens next?</h3>
              <p className="text-sm text-gray-700">
                Our team will review your booking request and contact you within 24 hours to confirm
                the details and finalize your move. Please keep your phone available for our call.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center no-print">
          <Link
            href={`/${businessSlug}/home-removal`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Start a new booking
          </Link>
        </div>
      </div>
    </div>
  );
}
