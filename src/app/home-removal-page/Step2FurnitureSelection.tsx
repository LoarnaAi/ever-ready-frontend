/** @format */

"use client";

import { useState } from "react";
import { getFurnitureIcon } from "./furnitureIcons";

interface Step2FurnitureSelectionProps {
  serviceParam: string | null;
  onContinue: (quantities: { [key: string]: number }) => void;
  currentStep?: number;
  setCurrentStep?: (step: number) => void;
  initialFurnitureQuantities?: { [key: string]: number };
}

export default function Step2FurnitureSelection({
  serviceParam,
  onContinue,
  initialFurnitureQuantities = {},
}: Step2FurnitureSelectionProps) {
  // Helper function to convert name to ID
  const nameToId = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Function to get initial furniture quantities based on service
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
        [nameToId("Large Boxes")]: 2,
      };
    }
    return {};
  };

  // Merge provided initialFurnitureQuantities with service-based prepopulation
  const mergedInitialQuantities = {
    ...getInitialFurnitureQuantities(serviceParam),
    ...initialFurnitureQuantities,
  };

  const [furnitureQuantities, setFurnitureQuantities] = useState<{
    [key: string]: number;
  }>(mergedInitialQuantities);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Inventory list structure
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

  // Convert inventory list to furniture items array

  // Flatten inventory list into furniture items array and deduplicate by ID
  const furnitureItemsMap = new Map<string, { id: string; title: string; image: string; category: string }>();
  
  Object.entries(INVENTORY_LIST).forEach(([category, items]) => {
    items.forEach((itemName) => {
      const itemId = nameToId(itemName);
      // Only add if not already present (first occurrence wins)
      if (!furnitureItemsMap.has(itemId)) {
        furnitureItemsMap.set(itemId, {
          id: itemId,
          title: itemName,
          image: itemId,
          category: category,
        });
      }
    });
  });
  
  // Convert map to array - each item appears only once
  const furnitureItems = Array.from(furnitureItemsMap.values());

  const handleAddFurniture = (itemId: string) => {
    setFurnitureQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleIncrementQuantity = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFurnitureQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleDecrementQuantity = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFurnitureQuantities((prev) => {
      const currentQuantity = prev[itemId] || 0;
      const initialQuantity = mergedInitialQuantities[itemId] || 0;
      
      // For prepopulated items, don't go below initial quantity
      if (initialQuantity > 0) {
        if (currentQuantity <= initialQuantity) {
          // Can't go below initial quantity, just return current state
          return prev;
        }
        return {
          ...prev,
          [itemId]: currentQuantity - 1,
        };
      }
      
      // For non-prepopulated items, allow deletion when reaching 0
      if (currentQuantity <= 1) {
        const newQuantities = { ...prev };
        delete newQuantities[itemId];
        return newQuantities;
      }
      return {
        ...prev,
        [itemId]: currentQuantity - 1,
      };
    });
  };

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

  // Separate prepopulated items from additional items
  const additionalItems: { id: string; name: string; quantity: number }[] = [];
  
  // Organize prepopulated furniture by category (only show initial quantities)
  const organizedFurniture = Object.entries(mergedInitialQuantities).reduce(
    (acc, [itemId, initialQuantity]) => {
      if (initialQuantity > 0) {
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
            quantity: initialQuantity,
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
              quantity: initialQuantity,
            });
          }
        }
      }
      return acc;
    },
    {} as { [category: string]: { id: string; name: string; quantity: number }[] }
  );

  // Calculate additional items (items added beyond initial quantities)
  // Use the same names as shown in the furniture cards
  // Show items in additional section when ANY quantity is added beyond initial
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar - Quote Summary */}
        <div className="w-full lg:w-72 bg-white border border-gray-200 p-5 flex flex-col rounded-xl shadow-md order-1 lg:order-1">
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
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {currentService.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Base package</p>
              </div>
              <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                Details
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span className="font-medium">Step 2 of 6</span>
                <span className="text-gray-400">33%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: "33.33%" }}
                ></div>
              </div>
            </div>

            {/* Organized Furniture List by Room/Area */}
            <div className="space-y-4 mb-3 max-h-[450px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
              {categoryOrder.map((category) => {
                const items = organizedFurniture[category];
                if (!items || items.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-1.5">
                      {category}
                    </h4>
                    <div className="space-y-1.5 pl-1">
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
              {Object.keys(organizedFurniture).length === 0 && (
                <div className="text-xs text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <p>No items selected yet</p>
                </div>
              )}

              {/* Additional Items Section */}
              {additionalItems.length > 0 && (
                <div className="space-y-2 pt-4 mt-4 border-t-2 border-orange-200 bg-orange-50/30 -mx-4 px-4 pb-3 rounded-b-lg">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                      Additional items
                    </h4>
                  </div>
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
                </div>
              )}
            </div>

          </div>

          {/* Guarantee Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="font-semibold text-xs text-gray-900 mb-1.5">
              No Surprises Guarantee
            </div>
            <p className="text-xs text-gray-700">
              We'll complete the job, no matter how long it takes - at no extra
              charge - As long as the items, access, and dismantling info are
              accurate.
            </p>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500">
            *Extra charges may apply for undeclared items.
          </p>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-4 sm:p-6 order-2 lg:order-2">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
              Add or Remove Inventory List
            </h2>
            <p className="text-sm text-gray-600">
              Please type item you want to add or remove from the inventory list
            </p>
          </div>

          {/* Search Box */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for furniture items..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {(() => {
              // Filter and deduplicate by ID to ensure each item appears only once
              const seenIds = new Set<string>();
              const filteredItems = furnitureItems.filter((item) => {
                const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
                const isUnique = !seenIds.has(item.id);
                if (isUnique && matchesSearch) {
                  seenIds.add(item.id);
                  return true;
                }
                return false;
              });

              if (searchQuery && filteredItems.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm">No items found matching "{searchQuery}"</p>
                  </div>
                );
              }

              if (!searchQuery) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm">Start typing to search for furniture items</p>
                  </div>
                );
              }

              return filteredItems.map((item) => {
                const quantity = furnitureQuantities[item.id] || 0;
                const initialQuantity = mergedInitialQuantities[item.id] || 0;
                const additionalQuantity = quantity > initialQuantity ? quantity - initialQuantity : 0;
                const isSelected = quantity > 0;
                const isPrepopulated = initialQuantity > 0;

                return (
                  <div
                    key={item.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/30"
                        : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex items-start gap-3">
                        <div className="mt-0.5">
                          {getFurnitureIcon(item.id, item.title, 20)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          {isPrepopulated && (
                            <div className="text-xs text-orange-600 font-medium mt-1 flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
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
                              Already in package ({initialQuantity})
                              {additionalQuantity > 0 && (
                                <span className="text-gray-600 ml-1">
                                  + {additionalQuantity} additional
                                </span>
                              )}
                            </div>
                          )}
                          {!isPrepopulated && isSelected && additionalQuantity > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="text-orange-600 font-medium">
                                {additionalQuantity} additional item{additionalQuantity > 1 ? "s" : ""} added
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {isPrepopulated ? (
                          // Prepopulated items - show count buttons for additional quantity
                          additionalQuantity > 0 ? (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDecrementQuantity(item.id, e);
                                }}
                                className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700"
                              >
                                <span className="text-lg font-medium leading-none">−</span>
                              </button>
                              <span className="text-base font-bold text-gray-900 min-w-[1.5rem] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIncrementQuantity(item.id, e);
                                }}
                                className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700"
                              >
                                <span className="text-lg font-medium leading-none">+</span>
                              </button>
                            </div>
                          ) : (
                            // Prepopulated but no additional - show Add button to add more
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFurniture(item.id);
                              }}
                              className="px-4 py-2 rounded-lg font-medium transition-all text-sm bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                            >
                              Add More
                            </button>
                          )
                        ) : isSelected ? (
                          // Non-prepopulated selected items - show quantity controls
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecrementQuantity(item.id, e);
                              }}
                              className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700"
                            >
                              <span className="text-lg font-medium leading-none">−</span>
                            </button>
                            <span className="text-base font-bold text-gray-900 min-w-[1.5rem] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncrementQuantity(item.id, e);
                              }}
                              className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700"
                            >
                              <span className="text-lg font-medium leading-none">+</span>
                            </button>
                          </div>
                        ) : (
                          // Not selected - show Add button
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddFurniture(item.id);
                            }}
                            className="px-4 py-2 rounded-lg font-medium transition-all text-sm bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Continue Button */}
          <div className="mt-6 flex justify-center sm:justify-end">
            <button
              onClick={() => onContinue(furnitureQuantities)}
              className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 shadow-lg transition-all text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
