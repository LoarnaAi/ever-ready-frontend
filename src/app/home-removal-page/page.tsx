/** @format */

"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Step2FurnitureSelection from "./Step2FurnitureSelection";
import Step3PackingService from "./Step3PackingService";
import Step4AddressDetails from "./Step4AddressDetails";

function HomeRemovalPageContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const [currentStep, setCurrentStep] = useState<number>(2); // Start at step 2 if service param exists
  const [selectedService, setSelectedService] = useState<string>(
    serviceParam || ""
  );

  // State to track data from each step
  const [furnitureQuantities, setFurnitureQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedDismantlePackage, setSelectedDismantlePackage] =
    useState<boolean>(false);
  const [packingMaterialQuantities, setPackingMaterialQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedPackingService, setSelectedPackingService] =
    useState<string>("");

  // Only set service on initial mount, don't reset step on re-renders
  useEffect(() => {
    if (serviceParam && !selectedService) {
      setSelectedService(serviceParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStep2Continue = (
    quantities: { [key: string]: number },
    dismantlePackage: boolean
  ) => {
    setFurnitureQuantities(quantities);
    setSelectedDismantlePackage(dismantlePackage);
    setCurrentStep(3);
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

  const handleStep4Continue = () => {
    setCurrentStep(5);
    // Continue to step 5 (future implementation)
  };

  // Render step 2 when service param exists
  if (currentStep === 2 && selectedService) {
    return (
      <Step2FurnitureSelection
        serviceParam={selectedService}
        onContinue={(quantities) => handleStep2Continue(quantities, false)}
      />
    );
  }

  // Render step 3
  if (currentStep === 3 && selectedService) {
    return (
      <Step3PackingService
        serviceParam={selectedService}
        onContinue={handleStep3Continue}
        onPrevious={() => setCurrentStep(2)}
        furnitureQuantities={furnitureQuantities}
        selectedDismantlePackage={selectedDismantlePackage}
      />
    );
  }

  // Render step 4
  if (currentStep === 4 && selectedService) {
    return (
      <Step4AddressDetails
        serviceParam={selectedService}
        onContinue={handleStep4Continue}
        onPrevious={() => setCurrentStep(3)}
        furnitureQuantities={furnitureQuantities}
        selectedDismantlePackage={selectedDismantlePackage}
        packingMaterialQuantities={packingMaterialQuantities}
        selectedPackingService={selectedPackingService}
      />
    );
  }

  // For future steps, add them here
  return null;
}

export default function HomeRemovalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-gray-600 text-sm sm:text-base">Loading...</div>
        </div>
      }
    >
      <HomeRemovalPageContent />
    </Suspense>
  );
}
