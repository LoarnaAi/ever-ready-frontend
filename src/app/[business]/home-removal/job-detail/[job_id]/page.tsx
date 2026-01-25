/** @format */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getJobAction,
  updateJobStatusAction,
  updateInternalNotesAction,
} from "@/lib/actions/jobActions";
import { formatJobId } from "@/lib/utils/jobUtils";
import { JobData, JobStatus } from "@/lib/database.types";
import { useBusinessConfig } from "@/lib/business";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.job_id as string;
  const businessSlug = params.business as string;
  const { theme } = useBusinessConfig();

  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const primaryTextStyle = { color: theme.primary };
  const primaryBgStyle = { backgroundColor: theme.primary };

  useEffect(() => {
    async function fetchJob() {
      if (jobId) {
        const result = await getJobAction(jobId);
        if (result.success && result.data) {
          setJob(result.data);
          setNotes(result.data.internalNotes);
        } else {
          setJob(null);
        }
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  const handleStatusChange = async (newStatus: JobStatus) => {
    const result = await updateJobStatusAction(jobId, newStatus);
    if (result.success) {
      setJob((prev) => (prev ? { ...prev, status: newStatus } : null));
      setStatusUpdated(true);
      setTimeout(() => setStatusUpdated(false), 2000);
    }
  };

  const handleSaveNotes = async () => {
    const result = await updateInternalNotesAction(jobId, notes);
    if (result.success) {
      setJob((prev) => (prev ? { ...prev, internalNotes: notes } : null));
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }
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
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
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

  const getFloorLabel = (floor: string) => {
    if (floor === "ground" || floor === "0") return "Ground Floor";
    if (floor === "6+") return "6th Floor or Higher";
    return `Floor ${floor}`;
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
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href={`/${businessSlug}/home-removal`} className="hover:text-gray-700">Home</Link>
                <span>/</span>
                <span className="text-gray-900">Job Details</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{formatJobId(job.job_id, job.display_job_id)}</h1>
                {statusUpdated && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    Status Updated!
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Submitted: {formatCreatedAt(job.created_at)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Status Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm cursor-pointer focus:ring-2 outline-none ${getStatusColor(job.status)}`}
                  style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {/* View Customer Summary Link */}
              <Link
                href={`/${businessSlug}/home-removal/job-summary/${jobId}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: theme.primary, backgroundColor: theme.primaryLight }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Customer Summary
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
              <div className="grid grid-cols-2 gap-4">
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Furniture Items</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {job.furnitureItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-medium text-gray-900">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses - Detailed */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.collectionAddress && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium uppercase tracking-wide mb-3" style={primaryTextStyle}>Collection From</p>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {job.collectionAddress.address || job.collectionAddress.postcode}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{job.collectionAddress.postcode}</p>
                    <div className="space-y-1 text-xs text-gray-600 border-t pt-3">
                      <p><span className="font-medium">Floor:</span> {getFloorLabel(job.collectionAddress.floor)}</p>
                      <p>
                        <span className="font-medium">Parking:</span>{" "}
                        {job.collectionAddress.hasParking ? (
                          <span className="text-green-600">Available</span>
                        ) : (
                          <span className="text-red-600">Not Available</span>
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Lift:</span>{" "}
                        {job.collectionAddress.hasLift ? (
                          <span className="text-green-600">Available</span>
                        ) : (
                          <span className="text-red-600">Not Available</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {job.deliveryAddress && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium uppercase tracking-wide mb-3" style={primaryTextStyle}>Delivery To</p>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {job.deliveryAddress.address || job.deliveryAddress.postcode}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{job.deliveryAddress.postcode}</p>
                    <div className="space-y-1 text-xs text-gray-600 border-t pt-3">
                      <p><span className="font-medium">Floor:</span> {getFloorLabel(job.deliveryAddress.floor)}</p>
                      <p>
                        <span className="font-medium">Parking:</span>{" "}
                        {job.deliveryAddress.hasParking ? (
                          <span className="text-green-600">Available</span>
                        ) : (
                          <span className="text-red-600">Not Available</span>
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Lift:</span>{" "}
                        {job.deliveryAddress.hasLift ? (
                          <span className="text-green-600">Available</span>
                        ) : (
                          <span className="text-red-600">Not Available</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
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

            {/* Packing Services */}
            {(job.packingService || job.dismantlePackage || job.packingMaterials.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Packing Services</h2>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Contact</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</p>
                  <p className="font-medium text-gray-900">
                    {job.contact.firstName} {job.contact.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <a href={`mailto:${job.contact.email}`} className="font-medium" style={primaryTextStyle}>
                    {job.contact.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <a href={`tel:${job.contact.countryCode}${job.contact.phone}`} className="font-medium" style={primaryTextStyle}>
                    {job.contact.countryCode} {job.contact.phone}
                  </a>
                </div>
                {job.contact.signUpForNews && (
                  <div className="pt-2 border-t">
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Subscribed to newsletter
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cost Breakdown */}
            {job.costBreakdown && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price ({getHomeSizeTitle(job.homeSize)})</span>
                    <span className="font-medium">£{job.costBreakdown.basePrice}</span>
                  </div>
                  {job.costBreakdown.furnitureCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Additional Items</span>
                      <span className="font-medium">£{job.costBreakdown.furnitureCharge}</span>
                    </div>
                  )}
                  {job.costBreakdown.packingMaterialsCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Packing Services</span>
                      <span className="font-medium">£{job.costBreakdown.packingMaterialsCharge}</span>
                    </div>
                  )}
                  {job.costBreakdown.floorSurcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Floor Surcharge</span>
                      <span className="font-medium">£{job.costBreakdown.floorSurcharge}</span>
                    </div>
                  )}
                  {job.costBreakdown.distanceSurcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Distance Surcharge</span>
                      <span className="font-medium">£{job.costBreakdown.distanceSurcharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Estimated Total</span>
                    <span className="font-bold text-lg" style={primaryTextStyle}>£{job.costBreakdown.total}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * Final price may vary based on actual conditions
                </p>
              </div>
            )}

            {/* Internal Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Internal Notes</h2>
                {notesSaved && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    Saved!
                  </span>
                )}
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this job..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none resize-none"
                style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
              />
              <button
                onClick={handleSaveNotes}
                className="mt-3 w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Save Notes
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <a
                  href={`mailto:${job.contact.email}?subject=Regarding Your Booking ${formatJobId(job.job_id, job.display_job_id)}`}
                  className="flex items-center gap-2 w-full py-2 px-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
                <a
                  href={`tel:${job.contact.countryCode}${job.contact.phone}`}
                  className="flex items-center gap-2 w-full py-2 px-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Customer
                </a>
                <Link
                  href={`/${businessSlug}/home-removal/job-summary/${jobId}`}
                  target="_blank"
                  className="flex items-center gap-2 w-full py-2 px-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Customer View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
