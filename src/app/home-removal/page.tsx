/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step2FurnitureSelection from "../home-removal-page/Step2FurnitureSelection";
import Step3PackingService from "../home-removal-page/Step3PackingService";
import Step4AddressDetails from "../home-removal-page/Step4AddressDetails";
import Step5DateScheduling from "../home-removal-page/Step5DateScheduling";
import Step6ContactDetails from "../home-removal-page/Step6ContactDetails";
import MobileBottomSheet from "@/components/MobileBottomSheet";
import ConfirmationModal from "@/components/ConfirmationModal";
import {
  createJob,
  FurnitureItem,
  PackingMaterial,
  ContactDetails,
} from "@/lib/tempDb";

export default function HomeRemoval() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [submittedJobId, setSubmittedJobId] = useState<string>("");
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
      title: "1 Bedroom Home",
      bedrooms: 1,
    },
    {
      id: "2-bedrooms",
      title: "2 Bedroom Home",
      bedrooms: 2,
    },
    {
      id: "3-bedrooms",
      title: "3 Bedroom Home",
      bedrooms: 3,
    },
    {
      id: "4-bedrooms",
      title: "4 Bedroom Home",
      bedrooms: 4,
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

  const handleStep2Previous = () => {
    setCurrentStep(1);
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

  // Helper to convert furniture quantities to items array
  const convertToFurnitureItems = (
    quantities: { [key: string]: number },
    includeNames = true
  ): FurnitureItem[] => {
    const furnitureNames: { [key: string]: string } = {
      "single-bed": "Single Bed & Mattress",
      "double-king-bed": "Double Bed & Mattress",
      "kingsize-bed": "Kingsize Bed & Mattress",
      "wardrobe": "Single Wardrobe",
      "double-wardrobe": "Double Wardrobe",
      "chest-of-drawers": "Chest Of Drawers",
      "bedside-table": "Bedside Table",
      "dressing-table": "Dressing Table",
      "tv-small": "Small Television/TV",
      "tv-large": "Large Television/TV",
      "sofa-2-seater": "Two Seater Sofa",
      "sofa-3-seater": "Three Seater Sofa",
      "armchair": "Armchair",
      "coffee-table": "Coffee Table",
      "side-table": "Side Table",
      "tv-stand": "TV Stand",
      "bookcase": "Bookcase",
      "rug": "Rug",
      "desk": "Desk",
      "office-chair": "Office Chair",
      "floor-lamp": "Floor Lamp",
      "dining-table": "4 Seater Dining Table",
      "dining-table-6": "6 Seater Dining Table",
      "dining-chair": "Dining Chair",
      "sideboard": "Sideboard",
      "fridge-freezer": "Fridge Freezer",
      "washing-machine": "Washing Machine",
      "microwave": "Microwave Oven",
      "cooker-oven": "Cooker",
      "dishwasher": "Dishwasher",
      "kitchen-table": "Kitchen Table",
      "bin": "Bin",
      "ironing-board": "Ironing Board",
      "tumble-dryer": "Tumble Dryer",
      "bathroom-mirror": "Small Mirror",
      "bathroom-mirror-large": "Large Mirror",
      "bathroom-cabinet": "Bathroom Cabinet",
      "garden-table": "Garden Table",
      "garden-chair": "Garden Chair",
      "lawn-mower": "Lawn Mower",
      "small-box": "Small Boxes",
      "medium-box": "Medium Boxes",
      "large-box": "Large Boxes",
      "wardrobe-box": "Wardrobe Boxes",
      "suitcase": "Suitcase",
      "bag": "Bag",
      "monitor": "Monitor",
      "coffee-side-table": "Coffee/Side Table",
    };

    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, quantity]) => ({
        itemId,
        name: includeNames ? (furnitureNames[itemId] || itemId) : itemId,
        quantity,
      }));
  };

  // Helper to convert packing materials
  const convertToPackingMaterials = (
    quantities: { [key: string]: number }
  ): PackingMaterial[] => {
    const materialNames: { [key: string]: string } = {
      "small-boxes": "Small Boxes",
      "large-boxes": "Large Boxes",
      "wardrobe-boxes": "Wardrobe Boxes",
      "tape": "Tape",
      "bubble-wrap": "Bubble Wrap",
      "paper-pack": "Paper Pack",
      "stretch-wrap": "Stretch Wrap",
    };

    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([materialId, quantity]) => ({
        materialId,
        name: materialNames[materialId] || materialId,
        quantity,
      }));
  };

  // Load saved addresses and dates from localStorage
  const loadSavedData = () => {
    if (typeof window === "undefined") {
      return {
        collectionAddress: null,
        deliveryAddress: null,
        collectionDate: null,
        materialsDeliveryDate: null,
      };
    }

    const collectionAddress = localStorage.getItem("step4_collectionAddress");
    const deliveryAddress = localStorage.getItem("step4_deliveryAddress");
    const collectionDate = localStorage.getItem("step5_collectionDate");
    const materialsDelivery = localStorage.getItem("step5_materialsDelivery");

    return {
      collectionAddress: collectionAddress ? JSON.parse(collectionAddress) : null,
      deliveryAddress: deliveryAddress ? JSON.parse(deliveryAddress) : null,
      collectionDate: collectionDate ? JSON.parse(collectionDate) : null,
      materialsDeliveryDate: materialsDelivery ? JSON.parse(materialsDelivery) : null,
    };
  };

  const handleStep6Submit = (contactData: ContactDetails) => {
    // Load saved data from localStorage
    const savedData = loadSavedData();

    // Create job in temp database
    const jobId = createJob({
      homeSize: selectedService,
      furnitureItems: convertToFurnitureItems(furnitureQuantities),
      initialFurnitureItems: convertToFurnitureItems(initialFurnitureQuantities),
      packingService: selectedPackingService,
      packingMaterials: convertToPackingMaterials(packingMaterialQuantities),
      dismantlePackage: selectedDismantlePackage,
      collectionAddress: savedData.collectionAddress,
      deliveryAddress: savedData.deliveryAddress,
      collectionDate: savedData.collectionDate,
      materialsDeliveryDate: savedData.materialsDeliveryDate,
      contact: contactData,
    });

    // Store job ID and show confirmation modal
    setSubmittedJobId(jobId);
    setShowConfirmationModal(true);
  };

  const handleViewSummary = () => {
    router.push(`/home-removal/job-summary/${submittedJobId}`);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleStep6Previous = () => {
    setCurrentStep(5);
  };

  // Render step 6 when currentStep is 6
  if (currentStep === 6 && selectedService) {
    return (
      <>
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
        <ConfirmationModal
          isOpen={showConfirmationModal}
          jobId={submittedJobId}
          onClose={handleCloseModal}
          onViewSummary={handleViewSummary}
        />
      </>
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
        onPrevious={handleStep2Previous}
        initialFurnitureQuantities={furnitureQuantities}
      />
    );
  }

  // Get selected service title for display
  const getSelectedServiceTitle = () => {
    const service = serviceOptions.find((s) => s.id === selectedService);
    return service ? service.title : "Select home size";
  };

  // Render step 1 (service selection)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 1 of 6</span>
            <span className="text-sm text-gray-500">Home Size</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '16.66%' }}></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Left Section - Hidden on mobile, visible on tablet+ */}
          <div className="hidden md:flex md:flex-col w-full md:w-80 lg:w-96 bg-white p-6 rounded-lg shadow-sm">
            {/* Rating */}
            <div className="mb-4">
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
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Ever-Ready.ai (Demo)</h1>
            </div>

            {/* Service Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Home Removals</h2>

            {/* Intro Text */}
            <p className="text-sm text-gray-600 mb-6">
              Get an instant quote for your home move. Tell us about your property and we&apos;ll calculate the best price for your removal.
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-orange-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700">
                  Free 48-hour cancellation policy
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-orange-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700">
                  Insurance included in price
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-orange-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700">
                  Professional, vetted movers
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-orange-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700">
                  Instant online quote
                </span>
              </li>
            </ul>

            {/* Trust Badge */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure booking - Your data is protected</span>
              </div>
            </div>
          </div>

          {/* Right Section - Full width on mobile */}
          <div className="w-full md:flex-1 bg-white p-4 md:p-6 rounded-lg shadow-sm flex flex-col">
            {/* Mobile Header - Only visible on mobile */}
            <div className="md:hidden mb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Home Removals</h1>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.4/5 Trustpilot</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                How big is your home?
              </h2>
              <p className="text-base text-gray-600">
                Select your home size to get started with your quote
              </p>
            </div>

            {/* Service Options Grid - Single column on mobile, 2 columns on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {serviceOptions.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`bg-white border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all relative ${
                    selectedService === service.id
                      ? "border-orange-500 shadow-lg bg-orange-50"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  {/* House Icon with Bedroom Count */}
                  <div className="mb-3 h-16 flex items-center justify-center">
                    <div className="relative">
                      <svg
                        className={`w-14 h-14 ${
                          selectedService === service.id ? "text-orange-500" : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3L4 9v12h16V9l-8-6zm6 16h-3v-5H9v5H6v-9.5l6-4.5 6 4.5V19z" />
                        <path d="M10 14h4v5h-4z" opacity="0.3" />
                      </svg>
                      <span className={`absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedService === service.id
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {service.bedrooms}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-3 text-center">
                    {service.title}
                  </h3>

                  {/* Select Button - Larger touch target */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceSelect(service.id);
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-base min-h-[48px] ${
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

            {/* Continue Button - Full width on mobile */}
            <div className="mt-6">
              <button
                onClick={handleContinue}
                disabled={!selectedService}
                className={`w-full py-4 rounded-lg font-medium transition-all text-base min-h-[52px] ${
                  selectedService
                    ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet - Only visible on mobile */}
      <MobileBottomSheet
        peekContent={
          <div className="flex items-center gap-3 text-sm">
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L4 9v12h16V9l-8-6zm6 16h-3v-5H9v5H6v-9.5l6-4.5 6 4.5V19z" />
            </svg>
            <span className="font-medium text-gray-900">
              {selectedService ? getSelectedServiceTitle() : "Select home size"}
            </span>
            <span className="text-orange-500 ml-auto">View Details</span>
          </div>
        }
        title="Quote Summary"
      >
        <div className="space-y-4">
          {/* Selected Service */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Home Size</span>
            <span className="font-medium text-gray-900">
              {selectedService ? getSelectedServiceTitle() : "Not selected"}
            </span>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Included:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free 48-hour cancellation
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Insurance included
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Professional movers
              </li>
            </ul>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure booking - Your data is protected</span>
          </div>
        </div>
      </MobileBottomSheet>
    </div>
  );
}
