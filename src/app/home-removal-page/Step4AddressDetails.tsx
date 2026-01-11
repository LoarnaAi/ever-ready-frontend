/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import { getFurnitureIcon } from "./furnitureIcons";
import MobileJobDetailsAccordion from "@/components/MobileJobDetailsAccordion";

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

interface Step4AddressDetailsProps {
  serviceParam: string | null;
  onContinue: () => void;
  onPrevious: () => void;
  furnitureQuantities?: { [key: string]: number };
  initialFurnitureQuantities?: { [key: string]: number };
  selectedDismantlePackage?: boolean;
  packingMaterialQuantities?: { [key: string]: number };
  selectedPackingService?: string;
}

interface AddressData {
  postcode: string;
  address: string;
  floor: string;
  hasParking: boolean;
  hasLift: boolean;
  hasAdditionalAddress: boolean;
}

export default function Step4AddressDetails({
  serviceParam,
  onContinue,
  onPrevious,
  furnitureQuantities = {},
  initialFurnitureQuantities = {},
  selectedDismantlePackage = false,
  packingMaterialQuantities = {},
  selectedPackingService = "",
}: Step4AddressDetailsProps) {
  // Load saved address data from localStorage
  const loadSavedCollectionData = (): AddressData => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("step4_collectionAddress");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // If parsing fails, return default
        }
      }
    }
    return {
      postcode: "",
      address: "",
      floor: "",
      hasParking: true,
      hasLift: true,
      hasAdditionalAddress: false,
    };
  };

  const loadSavedDeliveryData = (): AddressData => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("step4_deliveryAddress");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // If parsing fails, return default
        }
      }
    }
    return {
      postcode: "",
      address: "",
      floor: "",
      hasParking: true,
      hasLift: true,
      hasAdditionalAddress: false,
    };
  };

  const [collectionAddress, setCollectionAddress] = useState<AddressData>(loadSavedCollectionData());
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>(loadSavedDeliveryData());
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

  // Refs for Google Places autocomplete (attached to postcode inputs)
  const collectionPostcodeInputRef = useRef<HTMLInputElement>(null);
  const deliveryPostcodeInputRef = useRef<HTMLInputElement>(null);
  const collectionAutocompleteRef = useRef<any>(null);
  const deliveryAutocompleteRef = useRef<any>(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

    // Skip if no API key
    if (!apiKey || apiKey === "your_google_places_api_key_here") {
      return;
    }

    // Extract postcode from address components or formatted address
    const extractPostcode = (place: any): string => {
      let postcode = "";

      if (place.address_components && Array.isArray(place.address_components)) {
        const postcodeComponent = place.address_components.find(
          (component: any) =>
            component.types &&
            Array.isArray(component.types) &&
            component.types.includes("postal_code")
        );

        if (postcodeComponent?.long_name) {
          postcode = postcodeComponent.long_name;
        }
      }

      // Fallback: Extract postcode from formatted address using regex
      if (!postcode && place.formatted_address) {
        const postcodeMatch = place.formatted_address.match(
          /[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i
        );
        if (postcodeMatch) {
          postcode = postcodeMatch[0].toUpperCase();
        }
      }

      return postcode;
    };

    // Function to initialize autocomplete for an input
    const initAutocomplete = (
      inputRef: React.RefObject<HTMLInputElement>,
      autocompleteRef: React.MutableRefObject<any>,
      updateAddress: (field: keyof AddressData, value: string | boolean) => void
    ) => {
      if (!window.google?.maps?.places || !inputRef.current) {
        return;
      }

      // Clean up existing instance
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }

      // Create new autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "gb" },
          fields: ["formatted_address", "address_components"],
        }
      );

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();

        if (place.formatted_address) {
          // Store the full address
          updateAddress("address", place.formatted_address);

          // Extract postcode
          const postcode = extractPostcode(place);
          if (postcode) {
            // Update postcode state
            updateAddress("postcode", postcode);
            // Set the input value to just the postcode
            if (inputRef.current) {
              inputRef.current.value = postcode;
            }
          }
        }
      });
    };

    // Load Google Maps API if not already loaded
    if (!window.google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => {
        // Small delay to ensure everything is ready
        setTimeout(() => {
          initAutocomplete(
            collectionPostcodeInputRef,
            collectionAutocompleteRef,
            updateCollectionAddress
          );
          initAutocomplete(
            deliveryPostcodeInputRef,
            deliveryAutocompleteRef,
            updateDeliveryAddress
          );
        }, 100);
      };
      document.head.appendChild(script);
    } else {
      // API already loaded, initialize immediately
      initAutocomplete(
        collectionPostcodeInputRef,
        collectionAutocompleteRef,
        updateCollectionAddress
      );
      initAutocomplete(
        deliveryPostcodeInputRef,
        deliveryAutocompleteRef,
        updateDeliveryAddress
      );
    }

    // Cleanup on unmount
    return () => {
      if (collectionAutocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(
          collectionAutocompleteRef.current
        );
      }
      if (deliveryAutocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(
          deliveryAutocompleteRef.current
        );
      }
    };
  }, []);

  const floorOptions = [
    { value: "", label: "Select floor" },
    { value: "basement", label: "Basement" },
    { value: "ground", label: "Ground floor" },
    { value: "1", label: "1st floor" },
    { value: "2", label: "2nd floor" },
    { value: "3", label: "3rd floor" },
    { value: "4", label: "4th floor" },
    { value: "5", label: "5th floor" },
    { value: "6+", label: "6th floor or above" },
  ];

  // Map service IDs to display info
  const serviceInfo: { [key: string]: { title: string } } = {
    "mini-move": { title: "Mini Move" },
    "1-bedroom": { title: "1 Bedroom - Inventory List" },
    "2-bedrooms": { title: "2 Bedrooms - Inventory List" },
    "3-bedrooms": { title: "3 Bedrooms - Inventory List" },
    "4-bedrooms": { title: "4 Bedrooms - Inventory List" },
    personalised: { title: "Personalised" },
  };

  const currentService = serviceInfo[serviceParam || ""] || {
    title: "3 bedrooms",
  };

  // Inventory list structure (same as Step2 and Step3)
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

  // Map furniture IDs to display names and categories based on inventory list
  const furnitureDisplayMap: {
    [key: string]: { name: string; category: string };
  } = {};

  // Build display map from inventory list
  Object.entries(INVENTORY_LIST).forEach(([category, items]) => {
    items.forEach((itemName) => {
      const itemId = nameToId(itemName);
      // Map category names to match existing structure
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
          // For 2 and 3 bedrooms, use "Bedrooms" (plural) instead of "Bedroom"
          if (
            category === "Bedroom" &&
            (serviceParam === "2-bedrooms" || serviceParam === "3-bedrooms")
          ) {
            category = "Bedrooms";
          }
          // For 4 bedrooms, use "Boxes and Packaging" instead of "Boxes & Packing"
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
          // Fallback for items not in map - try to find in furnitureItems
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
      // Prioritize furnitureItems title (same as shown in cards)
      const item = furnitureItems.find((f) => f.id === itemId);
      if (item) {
        additionalItems.push({
          id: itemId,
          name: item.title,
          quantity: additionalQuantity,
        });
      } else {
        // Fallback to display map if not in furnitureItems
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
      // Prioritize furnitureItems title (same as shown in cards)
      const item = furnitureItems.find((f) => f.id === itemId);
      if (item) {
        additionalItems.push({
          id: itemId,
          name: item.title,
          quantity: currentQuantity,
        });
      } else {
        // Fallback to display map if not in furnitureItems
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


  const updateCollectionAddress = (field: keyof AddressData, value: string | boolean) => {
    setCollectionAddress((prev) => {
      const updated = { ...prev, [field]: value };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("step4_collectionAddress", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateDeliveryAddress = (field: keyof AddressData, value: string | boolean) => {
    setDeliveryAddress((prev) => {
      const updated = { ...prev, [field]: value };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("step4_deliveryAddress", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Calculate total items for mobile summary
  const totalItems = Object.values(furnitureQuantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 4 of 6</span>
            <span className="text-sm text-gray-500">Addresses</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '66.66%' }}></div>
          </div>
        </div>

        {/* Mobile Accordion - View Job Details */}
        <MobileJobDetailsAccordion title="View Job Details">
          {/* Quote Summary Card - Same as desktop */}
          <div className="bg-white rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                {currentService.title}
              </h3>
            </div>

            {/* Progress Indicator */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                <span>Step 4 of 6</span>
                <span className="text-gray-400">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full transition-all"
                  style={{ width: "66.67%" }}
                ></div>
              </div>
            </div>

            {/* Checkout Container - Same accordion sections as desktop */}
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
                      {collectionAddress.postcode && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800">Collection:</div>
                          <div className="text-xs text-gray-700 pl-2">
                            {collectionAddress.address || collectionAddress.postcode}
                            {collectionAddress.floor && `, Floor: ${collectionAddress.floor}`}
                          </div>
                        </div>
                      )}
                      {deliveryAddress.postcode && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800">Delivery:</div>
                          <div className="text-xs text-gray-700 pl-2">
                            {deliveryAddress.address || deliveryAddress.postcode}
                            {deliveryAddress.floor && `, Floor: ${deliveryAddress.floor}`}
                          </div>
                        </div>
                      )}
                      {!collectionAddress.postcode && !deliveryAddress.postcode && (
                        <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p>No move details</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500">
              *Extra charges may apply for undeclared items.
            </p>
          </div>
        </MobileJobDetailsAccordion>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Left Sidebar - Quote Summary - Hidden on mobile */}
          <div className="hidden md:flex md:flex-col w-full md:w-80 lg:w-96 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
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
            <div className="mb-4">
              <h1 className="text-xl font-bold text-orange-500">Ever Ready</h1>
            </div>

            {/* Quote Summary Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">
                  {currentService.title}
                </h3>
                <button className="text-xs text-orange-500 hover:text-orange-600">
                  Details
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                  <span>Step 4 of 6</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-orange-500 h-1.5 rounded-full transition-all"
                    style={{ width: "66.67%" }}
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
                        {collectionAddress.postcode && (
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-800">Collection:</div>
                            <div className="text-xs text-gray-700 pl-2">
                              {collectionAddress.address || collectionAddress.postcode}
                              {collectionAddress.floor && `, Floor: ${collectionAddress.floor}`}
                            </div>
                          </div>
                        )}
                        {deliveryAddress.postcode && (
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-800">Delivery:</div>
                            <div className="text-xs text-gray-700 pl-2">
                              {deliveryAddress.address || deliveryAddress.postcode}
                              {deliveryAddress.floor && `, Floor: ${deliveryAddress.floor}`}
                            </div>
                          </div>
                        )}
                        {!collectionAddress.postcode && !deliveryAddress.postcode && (
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
            <p className="text-xs text-gray-500 italic">
              *Extra charges may apply for undeclared items.
            </p>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-4 max-w-2xl order-2 lg:order-2">
            {/* Collection Postcode Section */}
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                What's your collection postcode in the UK?
              </h2>

              <div className="space-y-3 sm:space-y-2">
                {/* Postcode Input with Address Autocomplete */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="sm:w-32 text-xs font-medium text-gray-700">
                    Search Street Name or Address
                  </label>
                  <input
                    ref={collectionPostcodeInputRef}
                    type="text"
                    value={collectionAddress.postcode}
                    onChange={(e) =>
                      updateCollectionAddress("postcode", e.target.value.toUpperCase())
                    }
                    placeholder="Start typing address or postcode..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-600 placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Display selected address */}
                {collectionAddress.address && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                    <label className="sm:w-32 text-xs font-medium text-gray-700">
                      Street Name & Address
                    </label>
                    <div className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                      {collectionAddress.address}
                    </div>
                  </div>
                )}

                {/* Floor Select */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="sm:w-32 text-xs font-medium text-gray-700">
                    Floor
                  </label>
                  <select
                    value={collectionAddress.floor}
                    onChange={(e) => updateCollectionAddress("floor", e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-700 bg-white cursor-pointer"
                  >
                    {floorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${collectionAddress.hasParking
                        ? "bg-orange-500"
                        : "bg-white border-2 border-gray-300 group-hover:border-gray-400"
                        }`}
                      onClick={() =>
                        updateCollectionAddress("hasParking", !collectionAddress.hasParking)
                      }
                    >
                      {collectionAddress.hasParking && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-700">
                      Parking space close by for movers
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${collectionAddress.hasLift
                        ? "bg-orange-500"
                        : "bg-white border-2 border-gray-300 group-hover:border-gray-400"
                        }`}
                      onClick={() =>
                        updateCollectionAddress("hasLift", !collectionAddress.hasLift)
                      }
                    >
                      {collectionAddress.hasLift && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-700">Lift available</span>
                  </label>

                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 my-4" />

            {/* Delivery Postcode Section */}
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                What's your delivery postcode in the UK?
              </h2>

              <div className="space-y-3 sm:space-y-2">
                {/* Postcode Input with Address Autocomplete */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="sm:w-32 text-xs font-medium text-gray-700">
                    Search Street Name or Address
                  </label>
                  <input
                    ref={deliveryPostcodeInputRef}
                    type="text"
                    value={deliveryAddress.postcode}
                    onChange={(e) =>
                      updateDeliveryAddress("postcode", e.target.value.toUpperCase())
                    }
                    placeholder="Start typing address or postcode..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-600 placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>

                {/* Display selected address */}
                {deliveryAddress.address && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                    <label className="sm:w-32 text-xs font-medium text-gray-700">
                      Street Name & Address
                    </label>
                    <div className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                      {deliveryAddress.address}
                    </div>
                  </div>
                )}

                {/* Floor Select */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="sm:w-32 text-xs font-medium text-gray-700">
                    Floor
                  </label>
                  <select
                    value={deliveryAddress.floor}
                    onChange={(e) => updateDeliveryAddress("floor", e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-700 bg-white cursor-pointer"
                  >
                    {floorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${deliveryAddress.hasParking
                        ? "bg-orange-500"
                        : "bg-white border-2 border-gray-300 group-hover:border-gray-400"
                        }`}
                      onClick={() =>
                        updateDeliveryAddress("hasParking", !deliveryAddress.hasParking)
                      }
                    >
                      {deliveryAddress.hasParking && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-700">
                      Parking space close by for movers
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${deliveryAddress.hasLift
                        ? "bg-orange-500"
                        : "bg-white border-2 border-gray-300 group-hover:border-gray-400"
                        }`}
                      onClick={() =>
                        updateDeliveryAddress("hasLift", !deliveryAddress.hasLift)
                      }
                    >
                      {deliveryAddress.hasLift && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-700">Lift available</span>
                  </label>

                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 my-4" />

            {/* API Key Warning */}
            {(!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ||
              process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ===
              "your_google_places_api_key_here") && (
                <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <div className="font-medium mb-1">Google Places API Key Required</div>
                  <div className="text-xs">
                    Add your Google Places API key to .env.local for address autocomplete
                  </div>
                </div>
              )}

            {/* Please Note Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <h3 className="font-semibold text-xs text-gray-900 mb-1.5">Please note</h3>
              <div className="flex items-start gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0"
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
                <p className="text-xs text-gray-700">
                  Address changes require 48 hrs notice before booking date.
                </p>
              </div>
            </div>

            {/* Navigation Buttons - Full width stacked on mobile */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between sm:items-center">
              <button
                type="button"
                onClick={onPrevious}
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors text-base py-3 sm:py-2 border border-gray-300 rounded-lg sm:border-0 min-h-[48px] sm:min-h-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={onContinue}
                disabled={!collectionAddress.postcode || !deliveryAddress.postcode}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium shadow-lg transition-all text-base min-h-[48px] ${collectionAddress.postcode && deliveryAddress.postcode
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Guarantee Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
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
    </div>
  );
}


