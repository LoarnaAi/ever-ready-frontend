/** @format */

"use client";

import { useState } from "react";
import { getFurnitureIcon } from "./furnitureIcons";

interface Step6ContactDetailsProps {
  serviceParam: string | null;
  onSubmit: () => void;
  onPrevious: () => void;
  furnitureQuantities?: { [key: string]: number };
  initialFurnitureQuantities?: { [key: string]: number };
  selectedDismantlePackage?: boolean;
  packingMaterialQuantities?: { [key: string]: number };
  selectedPackingService?: string;
}

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  hasPromoCode: boolean;
  promoCode: string;
  signUpForNews: boolean;
  agreeToTerms: boolean;
}

export default function Step6ContactDetails({
  serviceParam,
  onSubmit,
  onPrevious,
  furnitureQuantities = {},
  initialFurnitureQuantities = {},
  selectedDismantlePackage = false,
  packingMaterialQuantities = {},
  selectedPackingService = "",
}: Step6ContactDetailsProps) {
  // Load saved contact data from localStorage
  const loadSavedContactData = (): ContactData => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("step6_contactData");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // If parsing fails, return default
        }
      }
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+44",
      phone: "",
      hasPromoCode: false,
      promoCode: "",
      signUpForNews: false,
      agreeToTerms: false,
    };
  };

  const [contactData, setContactDataState] = useState<ContactData>(loadSavedContactData());

  // Load saved address and date data from localStorage (from Steps 4 and 5)
  const loadSavedAddresses = () => {
    if (typeof window !== "undefined") {
      const collection = localStorage.getItem("step4_collectionAddress");
      const delivery = localStorage.getItem("step4_deliveryAddress");
      return {
        collection: collection ? JSON.parse(collection) : null,
        delivery: delivery ? JSON.parse(delivery) : null,
      };
    }
    return { collection: null, delivery: null };
  };

  const loadSavedDates = () => {
    if (typeof window !== "undefined") {
      const materialsDelivery = localStorage.getItem("step5_materialsDelivery");
      const collectionDate = localStorage.getItem("step5_collectionDate");
      return {
        materialsDelivery: materialsDelivery ? JSON.parse(materialsDelivery) : null,
        collectionDate: collectionDate ? JSON.parse(collectionDate) : null,
      };
    }
    return { materialsDelivery: null, collectionDate: null };
  };

  const savedAddresses = loadSavedAddresses();
  const savedDates = loadSavedDates();
  const [expandedSections, setExpandedSections] = useState<{
    prepopulated: boolean;
    additional: boolean;
    services: boolean;
    moveDetails: boolean;
  }>({
    prepopulated: false,
    additional: false,
    services: false,
    moveDetails: false,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Map service IDs to display info
  const serviceInfo: { [key: string]: { title: string } } = {
    "mini-move": { title: "Mini Move" },
    "1-bedroom": { title: "1 Bedroom" },
    "2-bedrooms": { title: "2 Bedrooms" },
    "3-bedrooms": { title: "3 Bedrooms" },
    "4-bedrooms": { title: "4 Bedrooms" },
    personalised: { title: "Personalised" },
  };

  const currentService = serviceInfo[serviceParam || ""] || {
    title: "3 bedrooms",
  };

  // Inventory list structure (same as Step2, Step3, Step4, and Step5)
  const INVENTORY_LIST: { [key: string]: string[] } = {
    Bedrooms: [
      "Single Bed & Mattress",
      "Double Bed & Mattress",
      "Kingsize Bed & Mattress",
      "Single Wardrobe",
      "Double Wardrobe",
      "Chest Of Drawers",
      "Bedside Table",
      "Dressing Table",
      "Television",
      "Side Table",
    ],
    Living: [
      "Two Seater Sofa",
      "Three Seater Sofa",
      "Armchair",
      "Coffee Table",
      'Small Television/TV (Less than 30")',
      'Large Television/TV (Greater than 40")',
      "TV Stand",
      "Bookcase",
      "Rug",
      "Desk",
      "Office Chair",
      "Artwork",
      "Floor Lamp",
    ],
    Dining: [
      "4 Seater Dining Table",
      "6 Seater Dining Table",
      "Dining Chair",
      "Sideboard",
      "Display Cabinet",
      "Rug",
    ],
    Kitchen: [
      "Fridge Freezer",
      "Washing Machine",
      "Microwave Oven",
      "Cooker",
      "Dishwasher",
      "Kitchen Table",
      "Dining Chair",
      "Bin",
      "Ironing Board",
      "Tumble Dryer",
    ],
    Bathroom: ["Large Mirror", "Small Mirror", "Rug", "Bathroom Cabinet", "Bath Tub"],
    Garden: [
      "Garden Table",
      "Garden Chair",
      "Lawn Mower",
      "Tool Box",
      "Bench",
      "Parasol",
      "Bicycle",
    ],
    Garage: [
      "Tool Chest",
      "Workbench",
      "Shelving Unit",
      "Ladder",
      "Bicycle",
      "Motorcycle",
      "Car Tyre Set",
      "Garden Tools Set",
      "Power Tools Box",
      "Storage Bin",
      "Sports Equipment Rack",
      "Spare Parts Box",
    ],
    "Boxes & Packaging": ["Small Boxes", "Large Boxes"],
  };

  // Helper function to convert name to ID
  const nameToId = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Function to get initial furniture quantities based on service (same as Step 2)
  const getInitialFurnitureQuantities = (service: string | null): { [key: string]: number } => {
    if (service === "1-bedroom") {
      return {
        [nameToId("Single Bed & Mattress")]: 1,
        [nameToId("Bedside Table")]: 1,
        [nameToId("Chest Of Drawers")]: 1,
        [nameToId("Two Seater Sofa")]: 1,
        [nameToId("Coffee Table")]: 1,
        [nameToId('Small Television/TV (Less than 30")')]: 1,
        [nameToId("Fridge Freezer")]: 1,
        [nameToId("Washing Machine")]: 1,
        [nameToId("Microwave Oven")]: 1,
        [nameToId("Cooker")]: 1,
        [nameToId("Small Boxes")]: 3,
        [nameToId("Medium Boxes")]: 4,
        [nameToId("Large Boxes")]: 2,
        [nameToId("Suitcase")]: 1,
      };
    }
    return {};
  };

  // Merge provided initialFurnitureQuantities with service-based prepopulation (same as Step 2)
  const mergedInitialQuantities = {
    ...getInitialFurnitureQuantities(serviceParam),
    ...initialFurnitureQuantities,
  };

  // Flatten inventory list into furniture items array
  const furnitureItems = Object.entries(INVENTORY_LIST).flatMap(([category, items]) =>
    items.map((itemName) => ({
      id: nameToId(itemName),
      title: itemName,
      image: nameToId(itemName),
      category: category,
    }))
  );

  // Map furniture IDs to display names and categories
  const furnitureDisplayMap: {
    [key: string]: { name: string; category: string };
  } = {};

  Object.entries(INVENTORY_LIST).forEach(([category, items]) => {
    items.forEach((itemName) => {
      const itemId = nameToId(itemName);
      let displayCategory = category;
      if (category === "Bedrooms") {
        displayCategory = "Bedroom";
      } else if (category === "Living") {
        displayCategory = "Living Room";
      } else if (category === "Garden") {
        displayCategory = "Garden / Outdoor";
      } else if (category === "Boxes & Packaging") {
        displayCategory = "Boxes & Packing";
      }
      furnitureDisplayMap[itemId] = {
        name: itemName,
        category: displayCategory,
      };
    });
  });

  // Organize prepopulated furniture by category (show current quantities from furnitureQuantities)
  // Use mergedInitialQuantities like Step 2 to ensure all prepopulated items are included
  const organizedFurniture = Object.entries(mergedInitialQuantities).reduce(
    (acc, [itemId, initialQuantity]) => {
      if (initialQuantity > 0) {
        // Get current quantity from furnitureQuantities, fallback to initialQuantity
        const currentQuantity = furnitureQuantities[itemId] || initialQuantity;
        const itemInfo = furnitureDisplayMap[itemId];
        if (itemInfo) {
          let category = itemInfo.category;
          if (
            category === "Bedroom" &&
            (serviceParam === "2-bedrooms" || serviceParam === "3-bedrooms")
          ) {
            category = "Bedrooms";
          }
          if (category === "Boxes & Packing" && serviceParam === "4-bedrooms") {
            category = "Boxes and Packaging";
          }
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            id: itemId,
            name: itemInfo.name,
            quantity: currentQuantity,
          });
        } else {
          const item = furnitureItems.find((f) => f.id === itemId);
          if (item) {
            if (!acc["Other"]) {
              acc["Other"] = [];
            }
            acc["Other"].push({
              id: itemId,
              name: item.title,
              quantity: currentQuantity,
            });
          }
        }
      }
      return acc;
    },
    {} as { [category: string]: { id: string; name: string; quantity: number }[] }
  );

  // Calculate additional items (items added beyond initial quantities)
  // Use mergedInitialQuantities like Step 2 to ensure correct comparison
  const additionalItems: { id: string; name: string; quantity: number }[] = [];
  
  Object.entries(furnitureQuantities).forEach(([itemId, currentQuantity]) => {
    const initialQuantity = mergedInitialQuantities[itemId] || 0;
    
    // Show in additional items if current quantity is greater than initial (even if just 1)
    if (currentQuantity > initialQuantity) {
      const additionalQuantity = currentQuantity - initialQuantity;
      const item = furnitureItems.find((f) => f.id === itemId);
      if (item) {
        additionalItems.push({
          id: itemId,
          name: item.title,
          quantity: additionalQuantity,
        });
      } else {
        const itemInfo = furnitureDisplayMap[itemId];
        if (itemInfo) {
          additionalItems.push({
            id: itemId,
            name: itemInfo.name,
            quantity: additionalQuantity,
          });
        }
      }
    } else if (currentQuantity > 0 && initialQuantity === 0) {
      // New item not in initial quantities - show immediately when added
      const item = furnitureItems.find((f) => f.id === itemId);
      if (item) {
        additionalItems.push({
          id: itemId,
          name: item.title,
          quantity: currentQuantity,
        });
      } else {
        const itemInfo = furnitureDisplayMap[itemId];
        if (itemInfo) {
          additionalItems.push({
            id: itemId,
            name: itemInfo.name,
            quantity: currentQuantity,
          });
        }
      }
    }
  });

  // Define category display order
  const categoryOrder = [
    "Bedroom",
    "Bedrooms",
    "Living Room",
    "Dining / Kitchen",
    "Dining",
    "Kitchen",
    "Bathroom",
    "Garden / Outdoor",
    "Boxes & Packing",
    "Boxes and Packaging",
    "Other",
  ];


  const updateContactData = (field: keyof ContactData, value: string | boolean) => {
    setContactDataState((prev) => {
      const updated = { ...prev, [field]: value };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("step6_contactData", JSON.stringify(updated));
      }
      return updated;
    });
  };
  
  // Create a setContactData function that works with the state
  const setContactData = (data: ContactData | ((prev: ContactData) => ContactData)) => {
    if (typeof data === "function") {
      setContactDataState((prev) => {
        const updated = data(prev);
        if (typeof window !== "undefined") {
          localStorage.setItem("step6_contactData", JSON.stringify(updated));
        }
        return updated;
      });
    } else {
      setContactDataState(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("step6_contactData", JSON.stringify(data));
      }
    }
  };

  const isFormValid = () => {
    return (
      contactData.firstName.trim() !== "" &&
      contactData.lastName.trim() !== "" &&
      contactData.email.trim() !== "" &&
      contactData.phone.trim() !== "" &&
      contactData.agreeToTerms
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar - Quote Summary */}
        <div className="w-full lg:w-96 bg-white border border-gray-200 p-4 flex flex-col rounded-lg shadow-sm order-1 lg:order-1">
          {/* Rating */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 text-xs">
              <span className="font-semibold text-gray-900">Excellent 4.4 out of 5</span>
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-600">Trustpilot</span>
            </div>
          </div>

          {/* Logo */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-orange-500">Ever Ready</h1>
          </div>

          {/* Quote Summary Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">{currentService.title}</h3>
              <button className="text-xs text-orange-500 hover:text-orange-600">Details</button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                <span>Step 6 of 6</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full transition-all"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>

            {/* Checkout Container */}
            <div className="space-y-4 mb-3 max-h-[450px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
              {/* 1. PrePopulated Items */}
              <div className="space-y-2">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, prepopulated: !prev.prepopulated }))}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-300 pb-2 hover:text-orange-500 transition-colors"
                >
                  <span>1. PrePopulated Items</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.prepopulated ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.prepopulated && (
                  <div className="pt-2">
                    {Object.keys(organizedFurniture).length > 0 ? (
                      <div className="space-y-3">
                        {categoryOrder.map((category) => {
                          const items = organizedFurniture[category];
                          if (!items || items.length === 0) return null;

                          return (
                            <div key={category} className="space-y-1.5">
                              <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1">
                                {category}
                              </h5>
                              <div className="space-y-1 pl-1">
                                {items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed"
                                  >
                                    <div className="mt-0.5">
                                      {getFurnitureIcon(item.id, item.name, 14)}
                                    </div>
                                    <span className="flex-1">
                                      <span className="text-gray-800 font-medium">{item.name}</span>
                                      {item.quantity > 1 && (
                                        <span className="text-gray-500 ml-1.5 font-normal">
                                          × {item.quantity}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p>No prepopulated items</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Additional Items */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, additional: !prev.additional }))}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-300 pb-2 hover:text-orange-500 transition-colors"
                >
                  <span>2. Additional Items</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.additional ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.additional && (
                  <div className="pt-2">
                    {additionalItems.length > 0 ? (
                      <div className="space-y-1.5 pl-1">
                        {additionalItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed"
                          >
                            <div className="mt-0.5">
                              {getFurnitureIcon(item.id, item.name, 14)}
                            </div>
                            <span className="flex-1">
                              <span className="text-gray-800 font-medium">{item.name}</span>
                              {item.quantity > 1 && (
                                <span className="text-gray-500 ml-1.5 font-normal">
                                  × {item.quantity}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p>No additional items</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Additional Services */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, services: !prev.services }))}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-300 pb-2 hover:text-orange-500 transition-colors"
                >
                  <span>3. Additional Services</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.services ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.services && (
                  <div className="pt-2">
                    <div className="space-y-1.5 pl-1">
                      {selectedPackingService && (
                        <div className="flex items-start gap-2 text-xs text-gray-700">
                          <svg className="w-3 h-3 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-800 font-medium">All Inclusive Packing</span>
                        </div>
                      )}
                      {selectedDismantlePackage && (
                        <div className="flex items-start gap-2 text-xs text-gray-700">
                          <svg className="w-3 h-3 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-800 font-medium">High Quality Packing Materials</span>
                        </div>
                      )}
                      {Object.keys(packingMaterialQuantities || {}).length > 0 && (
                        <div className="space-y-1 mt-2">
                          {Object.entries(packingMaterialQuantities || {}).map(([materialId, quantity]) => {
                            const materialNames: { [key: string]: string } = {
                              "small-boxes": "Small Boxes",
                              "large-boxes": "Large Boxes",
                              "wardrobe-boxes": "Wardrobe Boxes",
                              "tape": "Tape",
                              "bubble-wrap": "Bubble Wrap",
                              "paper-pack": "Paper Pack",
                              "stretch-wrap": "Stretch Wrap",
                            };
                            return (
                              <div key={materialId} className="flex items-start gap-2 text-xs text-gray-700 pl-1">
                                <span className="text-gray-800 font-medium">
                                  {materialNames[materialId] || materialId}: × {quantity}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {!selectedPackingService && !selectedDismantlePackage && Object.keys(packingMaterialQuantities || {}).length === 0 && (
                        <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p>No additional services</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Move Details */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, moveDetails: !prev.moveDetails }))}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-300 pb-2 hover:text-orange-500 transition-colors"
                >
                  <span>4. Move Details</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.moveDetails ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.moveDetails && (
                  <div className="pt-2">
                    <div className="space-y-2 pl-1">
                      {savedAddresses.collection?.postcode && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800">Collection:</div>
                          <div className="text-xs text-gray-700 pl-2">
                            {savedAddresses.collection.address || savedAddresses.collection.postcode}
                            {savedAddresses.collection.floor && `, Floor: ${savedAddresses.collection.floor}`}
                          </div>
                        </div>
                      )}
                      {savedAddresses.delivery?.postcode && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800">Delivery:</div>
                          <div className="text-xs text-gray-700 pl-2">
                            {savedAddresses.delivery.address || savedAddresses.delivery.postcode}
                            {savedAddresses.delivery.floor && `, Floor: ${savedAddresses.delivery.floor}`}
                          </div>
                        </div>
                      )}
                      {savedDates.collectionDate?.date && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800">Collection Date:</div>
                          <div className="text-xs text-gray-700 pl-2">
                            {formatDate(savedDates.collectionDate.date)} - {savedDates.collectionDate.timeSlot}
                          </div>
                        </div>
                      )}
                      {savedDates.materialsDelivery?.date && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800">Materials Delivery:</div>
                          <div className="text-xs text-gray-700 pl-2">
                            {formatDate(savedDates.materialsDelivery.date)} - {savedDates.materialsDelivery.timeSlot}
                          </div>
                        </div>
                      )}
                      {contactData.firstName && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800">Contact:</div>
                          <div className="text-xs text-gray-700 pl-2">
                            {contactData.firstName} {contactData.lastName}
                            {contactData.email && <div>{contactData.email}</div>}
                            {contactData.phone && <div>{contactData.countryCode} {contactData.phone}</div>}
                          </div>
                        </div>
                      )}
                      {!savedAddresses.collection?.postcode && !savedAddresses.delivery?.postcode && !savedDates.collectionDate?.date && !savedDates.materialsDelivery?.date && !contactData.firstName && (
                        <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p>No move details</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 italic">*Extra charges may apply for undeclared items.</p>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-4 max-w-2xl order-2 lg:order-2">
          {/* Heading */}
          <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">
            Leave your details, and our team will reach out to finalize your order
          </h2>

          {/* Contact Form */}
          <div className="space-y-3 sm:space-y-2">
            {/* First Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <label className="sm:w-24 text-xs font-medium text-gray-700">First name</label>
              <input
                type="text"
                value={contactData.firstName}
                onChange={(e) => updateContactData("firstName", e.target.value)}
                placeholder="First name"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-600 placeholder-gray-400"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <label className="sm:w-24 text-xs font-medium text-gray-700">Last name</label>
              <input
                type="text"
                value={contactData.lastName}
                onChange={(e) => updateContactData("lastName", e.target.value)}
                placeholder="Last name"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-600 placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <label className="sm:w-24 text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => updateContactData("email", e.target.value)}
                placeholder="Email"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-600 placeholder-gray-400"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <label className="sm:w-24 text-xs font-medium text-gray-700">Phone</label>
              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                <select
                  value={contactData.countryCode}
                  onChange={(e) => updateContactData("countryCode", e.target.value)}
                  className="px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-700 bg-white cursor-pointer"
                >
                  <option value="+44">GB +44</option>
                  <option value="+1">US +1</option>
                  <option value="+91">IN +91</option>
                  <option value="+49">DE +49</option>
                  <option value="+33">FR +33</option>
                </select>
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => updateContactData("phone", e.target.value)}
                  placeholder="Phone number"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Info Text */}
          <p className="mt-4 text-xs text-gray-700">
            Please ensure that you provide us with both a{" "}
            <span className="text-orange-500 font-medium">valid telephone number</span> and{" "}
            <span className="text-orange-500 font-medium">email address</span>, as we will use them to
            verify order details and contact you on the date of service. If we are unable to reach you, we
            might have to reschedule or, in some instances, cancel the service.
          </p>

          {/* Checkboxes */}
          <div className="mt-4 space-y-2">
            
            {/* Newsletter Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  contactData.signUpForNews
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-gray-300 group-hover:border-gray-400"
                }`}
                onClick={() => updateContactData("signUpForNews", !contactData.signUpForNews)}
              >
                {contactData.signUpForNews && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-700">
                Sign me up for early promotions and Ever Ready news
              </span>
            </label>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                  contactData.agreeToTerms
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-gray-300 group-hover:border-gray-400"
                }`}
                onClick={() => updateContactData("agreeToTerms", !contactData.agreeToTerms)}
              >
                {contactData.agreeToTerms && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-700">
                I agree with the{" "}
                <a href="/terms-and-conditions" className="text-orange-500 hover:underline">
                  Terms & Conditions
                </a>
                ,{" "}
                <a href="/privacy-policy" className="text-orange-500 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <span className="text-orange-500 hover:underline cursor-pointer">Cookie Preferences</span>
              </span>
            </label>
          </div>

          {/* Footer Note */}
          <p className="mt-4 text-xs text-gray-600">
            Please fill in your{" "}
            <span className="text-orange-500 font-medium">contact details</span> and agree to the{" "}
            <span className="text-orange-500 font-medium">terms and conditions</span> to finalize your
            order.
          </p>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-5">
            <button
              type="button"
              onClick={onPrevious}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`px-4 sm:px-6 py-2 text-sm rounded-lg font-semibold shadow-lg transition-all ${
                isFormValid()
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Guarantee Message - Moved to end for mobile view */}
      <div className="w-full max-w-6xl bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <div className="font-semibold text-xs text-gray-900 mb-1.5">
          No Surprises Guarantee
        </div>
        <p className="text-xs text-gray-700">
          We'll complete the job, no matter how long it takes - at no extra
          charge - As long as the items, access, and dismantling info are
          accurate.
        </p>
      </div>
    </div>
  );
}

