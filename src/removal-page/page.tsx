/** @format */

"use client";

// TODO: Remove this legacy page (scheduled for deletion).

import { useState } from "react";
import Step1MoveType from "./components/Step1MoveType";
import Step2QuoteForm from "./components/Step2QuoteForm";
import Step3CurrentHome from "./components/Step3CurrentHome";
import Step4MovingTo from "./components/Step4MovingTo";
import Step5AdditionalInfo from "./components/Step5AdditionalInfo";
import Step6ContactInfo from "./components/Step6ContactInfo";
import ProgressIndicator from "./components/ProgressIndicator";

export default function RemovalPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    moveType: "",
    typeOfMove: "Removals",
    movingArea: "Domestic",
    preferredDate: "",
    flexibleDates: "± 1 week",
    postcode: "",
    currentPostcode: "",
    currentAddress: "",
    currentPropertyType: "",
    currentHasLift: "",
    currentRooms: {
      bedrooms: 0,
      homeOffice: 0,
      bathrooms: 0,
      diningRoom: false,
      livingRoom: false,
      kitchen: false,
      terrace: false,
      garage: false,
    },
    newPostcode: "",
    newAddress: "",
    newPropertyType: "",
    newHasLift: "",
    heavyItems: "No",
    fragileItems: "No",
    additionalServices: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    comment: "",
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1MoveType
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2QuoteForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <Step3CurrentHome
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <Step4MovingTo
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <Step5AdditionalInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <Step6ContactInfo
            formData={formData}
            updateFormData={updateFormData}
            onPrevious={handlePrevious}
          />
        );
      default:
        return (
          <Step1MoveType
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2016&q=80')",
      }}
    >
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Main content box */}
          <div className="bg-white bg-opacity-98 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            {/* Service message */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-green-500 text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Service is free – No Obligation
              </div>
            </div>

            {/* Progress indicator */}
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
            />

            {/* Step content */}
            <div className="mt-8">{renderCurrentStep()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
