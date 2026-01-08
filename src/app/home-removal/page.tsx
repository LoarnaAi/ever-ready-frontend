/** @format */

"use client";

import { useState } from "react";
import Step2FurnitureSelection from "../home-removal-page/Step2FurnitureSelection";
import Step3PackingService from "../home-removal-page/Step3PackingService";
import Step4AddressDetails from "../home-removal-page/Step4AddressDetails";
import Step5DateScheduling from "../home-removal-page/Step5DateScheduling";
import Step6ContactDetails from "../home-removal-page/Step6ContactDetails";

export default function HomeRemoval() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [furnitureQuantities, setFurnitureQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [initialFurnitureQuantities, setInitialFurnitureQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedDismantlePackage, setSelectedDismantlePackage] =
    useState<boolean>(false);
  const [packingMaterialQuantities, setPackingMaterialQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedPackingService, setSelectedPackingService] =
    useState<string>("");

  // Prepopulated furniture quantities for each bedroom type
  const bedroomPrepopulatedQuantities: {
    [key: string]: { [key: string]: number };
  } = {
    "1-bedroom": {
      "single-bed": 1, // Single Bed (with/without mattress)
      "bedside-table": 1,
      "chest-of-drawers": 1,
      "sofa-2-seater": 1, // 2-Seater Sofa
      "coffee-side-table": 1,
      "tv-small": 1, // TV (small <30")
      "fridge-freezer": 1,
      "washing-machine": 1,
      "microwave": 1,
      "cooker-oven": 1,
      "small-box": 3,
      "medium-box": 4,
      "large-box": 2,
      "suitcase": 1,
    },
    "2-bedrooms": {
      "double-king-bed": 2, // Double Bed & Mattress (x2)
      "wardrobe": 2, // Wardrobe (x2)
      "chest-of-drawers": 2,
      "bedside-table": 2, // Bedside Table (x2-4 total, preselect 1 per bed)
      "tv-small": 1, // Small/Standard Bedroom TV (x1)
      "sofa-3-seater": 1, // Three Seater Sofa
      "armchair": 1,
      "coffee-table": 1,
      "side-table": 1,
      "tv-large": 1, // Large Television/TV
      "tv-stand": 1,
      "rug": 1,
      "dining-table": 1, // 4 Seater Dining Table
      "dining-chair": 4, // Dining Chairs (x4)
      "fridge-freezer": 1,
      "washing-machine": 1,
      "cooker-oven": 1,
      "microwave": 1,
      "bin": 1,
      "bathroom-cabinet": 1, // Small/Medium Bathroom Cabinet
      "bathroom-mirror": 1, // Small Mirror
      "garden-table": 1,
      "garden-chair": 2, // Garden Chairs (x2-4, preselect 2)
      "lawn-mower": 1,
      "small-box": 5,
      "medium-box": 10,
      "large-box": 5,
      "wardrobe-box": 2,
      "suitcase": 2,
      "bag": 3,
      "monitor": 1,
    },
    "3-bedrooms": {
      "double-king-bed": 2, // Double Bed & Mattress (x2)
      "wardrobe": 2, // Wardrobe (x2)
      "chest-of-drawers": 2,
      "bedside-table": 2, // Bedside Table (x2-4 total, preselect 1 per bed)
      "tv-small": 1, // Small/Standard Bedroom TV (x1)
      "sofa-3-seater": 1, // Three Seater Sofa
      "armchair": 1,
      "coffee-table": 1,
      "side-table": 1,
      "tv-large": 1, // Large Television/TV
      "tv-stand": 1,
      "rug": 1,
      "dining-table": 1, // 4 Seater Dining Table
      "dining-chair": 4, // Dining Chairs (x4)
      "fridge-freezer": 1,
      "washing-machine": 1,
      "cooker-oven": 1,
      "microwave": 1,
      "bin": 1,
      "bathroom-cabinet": 1, // Small/Medium Bathroom Cabinet
      "bathroom-mirror": 1, // Small Mirror
      "garden-table": 1,
      "garden-chair": 2, // Garden Chairs (x2-4, preselect 2)
      "lawn-mower": 1,
      "small-box": 5,
      "medium-box": 10,
      "large-box": 5,
      "wardrobe-box": 2,
      "suitcase": 2,
      "bag": 3,
      "monitor": 1,
    },
    "4-bedrooms": {
      "double-king-bed": 2, // Double Bed & Mattress (x2)
      "kingsize-bed": 1, // Kingsize Bed & Mattress (x1)
      "single-bed": 1, // Single Bed & Mattress (x1)
      "double-wardrobe": 2, // Double Wardrobe (x2)
      "chest-of-drawers": 2,
      "bedside-table": 4,
      "tv-small": 1, // Television (x1)
      "sofa-2-seater": 1, // Two Seater Sofa
      "sofa-3-seater": 1, // Three Seater Sofa
      "armchair": 2,
      "coffee-table": 1,
      "tv-large": 1, // Large Television/TV (Greater than 40")
      "tv-stand": 1,
      "bookcase": 1,
      "floor-lamp": 1,
      "rug": 1,
      "dining-table-6": 1, // 6 Seater Dining Table
      "dining-chair": 8, // 6 for dining table + 2 for kitchen table
      "sideboard": 1,
      "fridge-freezer": 1,
      "washing-machine": 1,
      "cooker-oven": 1,
      "microwave": 1,
      "kitchen-table": 1,
      "ironing-board": 1,
      "tumble-dryer": 1,
      "bathroom-mirror-large": 1, // Large Mirror
      "bathroom-cabinet": 1,
      "garden-table": 1,
      "garden-chair": 4,
      "lawn-mower": 1,
      "medium-box": 10,
      "large-box": 8,
      "small-box": 6,
      "wardrobe-box": 2,
      "suitcase": 2,
    },
  };

  const serviceOptions = [
    {
      id: "1-bedroom",
      title: "1 Bedroom - Inventory List",
      hasInfo: false,
    },
    {
      id: "2-bedrooms",
      title: "2 Bedrooms - Inventory List",
      hasInfo: false,
    },
    {
      id: "3-bedrooms",
      title: "3 Bedrooms - Inventory List",
      hasInfo: false,
    },
    {
      id: "4-bedrooms",
      title: "4 Bedrooms - Inventory List",
      hasInfo: false,
    },
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleContinue = () => {
    if (selectedService) {
      // Prepopulate furniture quantities based on selected bedroom type
      const prepopulatedQuantities = bedroomPrepopulatedQuantities[selectedService] || {};
      setFurnitureQuantities(prepopulatedQuantities);
      setInitialFurnitureQuantities(prepopulatedQuantities);
      setCurrentStep(2);
    }
  };

  const handlePersonalisedQuote = () => {
    setSelectedService("personalised");
    setCurrentStep(2);
  };

  const handleStep2Continue = (quantities: { [key: string]: number }) => {
    setFurnitureQuantities(quantities);
    setCurrentStep(3);
    // URL stays the same - just state change
  };

  const handleStep3Continue = (
    packingService: string,
    materialQuantities: { [key: string]: number },
    dismantlePackage: boolean
  ) => {
    setSelectedPackingService(packingService);
    setPackingMaterialQuantities(materialQuantities);
    setSelectedDismantlePackage(dismantlePackage);
    setCurrentStep(4);
  };

  const handleStep3Previous = () => {
    setCurrentStep(2);
  };

  const handleStep4Continue = () => {
    setCurrentStep(5);
  };

  const handleStep4Previous = () => {
    setCurrentStep(3);
  };

  const handleStep5Continue = () => {
    setCurrentStep(6);
  };

  const handleStep5Previous = () => {
    setCurrentStep(4);
  };

  const handleStep6Submit = () => {
    // Handle form submission - could redirect to success page or show confirmation
    alert("Order submitted successfully! Our team will contact you shortly.");
  };

  const handleStep6Previous = () => {
    setCurrentStep(5);
  };

  // Render step 6 when currentStep is 6
  if (currentStep === 6 && selectedService) {
    return (
      <Step6ContactDetails
        serviceParam={selectedService}
        onSubmit={handleStep6Submit}
        onPrevious={handleStep6Previous}
        furnitureQuantities={furnitureQuantities}
        initialFurnitureQuantities={initialFurnitureQuantities}
        selectedDismantlePackage={selectedDismantlePackage}
        packingMaterialQuantities={packingMaterialQuantities}
        selectedPackingService={selectedPackingService}
      />
    );
  }

  // Render step 5 when currentStep is 5
  if (currentStep === 5 && selectedService) {
    return (
      <Step5DateScheduling
        serviceParam={selectedService}
        onContinue={handleStep5Continue}
        onPrevious={handleStep5Previous}
        furnitureQuantities={furnitureQuantities}
        initialFurnitureQuantities={initialFurnitureQuantities}
        selectedDismantlePackage={selectedDismantlePackage}
        packingMaterialQuantities={packingMaterialQuantities}
        selectedPackingService={selectedPackingService}
      />
    );
  }

  // Render step 4 when currentStep is 4
  if (currentStep === 4 && selectedService) {
    return (
      <Step4AddressDetails
        serviceParam={selectedService}
        onContinue={handleStep4Continue}
        onPrevious={handleStep4Previous}
        furnitureQuantities={furnitureQuantities}
        initialFurnitureQuantities={initialFurnitureQuantities}
        selectedDismantlePackage={selectedDismantlePackage}
        packingMaterialQuantities={packingMaterialQuantities}
        selectedPackingService={selectedPackingService}
      />
    );
  }

  // Render step 3 when currentStep is 3
  if (currentStep === 3 && selectedService) {
    return (
      <Step3PackingService
        serviceParam={selectedService}
        onContinue={handleStep3Continue}
        onPrevious={handleStep3Previous}
        furnitureQuantities={furnitureQuantities}
        initialFurnitureQuantities={initialFurnitureQuantities}
      />
    );
  }

  // Render step 2 when currentStep is 2
  if (currentStep === 2 && selectedService) {
    return (
      <Step2FurnitureSelection
        serviceParam={selectedService}
        onContinue={handleStep2Continue}
        initialFurnitureQuantities={furnitureQuantities}
      />
    );
  }

  // Render step 1 (service selection)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left Section */}
        <div className="w-full lg:w-96 bg-white p-4 sm:p-6 flex flex-col order-1">
          {/* Rating */}
          <div className="mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-2 text-xs">
              <span className="font-semibold text-gray-900">
                Excellent 4.4 out of 5
              </span>
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-600">Trustpilot</span>
            </div>
          </div>

          {/* Logo */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Ever-Ready.ai (Demo)</h1>
          </div>

          {/* Service Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Home Removals</h2>

          {/* Features List */}
          <ul className="space-y-2 mb-6 sm:mb-8">
            <li className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-orange-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm text-gray-700">
                Free 48-hour cancellation policy
              </span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-orange-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm text-gray-700">
                Insurance included in price
              </span>
            </li>
          </ul>

          {/* Personalised Quote Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Personalised quote
              </h3>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              We will be in touch with you to discuss all the details of your
              move and provide you with an accurate quote.
            </p>
            <button
              onClick={handlePersonalisedQuote}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-xs sm:text-sm"
            >
              Get a quote
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 bg-gray-50 p-4 sm:p-6 flex flex-col order-2">
          {/* Heading */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              How big is your Home?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Please choose from the below options
            </p>
          </div>

          {/* Service Options Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3 flex-1">
            {serviceOptions.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service.id)}
                className={`bg-white border-2 rounded-lg p-4 sm:p-4 cursor-pointer transition-all relative ${
                  selectedService === service.id
                    ? "border-orange-500 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >

                {/* Moving Van Illustration */}
                <div className="mb-3 h-12 sm:h-16 flex items-center justify-center">
                  <svg
                    className="w-full h-full text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-1">
                  {service.title}
                </h3>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceSelect(service.id);
                  }}
                  className={`w-full py-2 px-3 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    selectedService === service.id
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {selectedService === service.id ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end">
            <button
              onClick={handleContinue}
              disabled={!selectedService}
              className={`w-full sm:w-auto px-6 py-2.5 sm:py-2.5 rounded-lg font-medium transition-all text-sm ${
                selectedService
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
