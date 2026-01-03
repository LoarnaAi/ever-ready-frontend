/** @format */

"use client";

import { useState } from "react";
import { getFurnitureIcon } from "./furnitureIcons";

interface Step5DateSchedulingProps {
  serviceParam: string | null;
  onContinue: () => void;
  onPrevious: () => void;
  furnitureQuantities?: { [key: string]: number };
  initialFurnitureQuantities?: { [key: string]: number };
  selectedDismantlePackage?: boolean;
  packingMaterialQuantities?: { [key: string]: number };
  selectedPackingService?: string;
}

interface ScheduleData {
  date: Date | null;
  timeSlot: string;
  intervalType: "6hours" | "2hours";
}

export default function Step5DateScheduling({
  serviceParam,
  onContinue,
  onPrevious,
  furnitureQuantities = {},
  initialFurnitureQuantities = {},
  selectedDismantlePackage = false,
  packingMaterialQuantities = {},
  selectedPackingService = "",
}: Step5DateSchedulingProps) {
  // Get tomorrow's date for materials delivery
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  // Get day after tomorrow for collection
  const getDayAfterTomorrow = () => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter;
  };

  // Load saved schedule data from localStorage
  const loadSavedMaterialsDelivery = (): ScheduleData => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("step5_materialsDelivery");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            date: parsed.date ? new Date(parsed.date) : getTomorrow(),
          };
        } catch (e) {
          // If parsing fails, return default
        }
      }
    }
    return {
      date: getTomorrow(),
      timeSlot: "9:00 - 15:00",
      intervalType: "6hours",
    };
  };

  const loadSavedCollectionDate = (): ScheduleData => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("step5_collectionDate");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            date: parsed.date ? new Date(parsed.date) : getDayAfterTomorrow(),
          };
        } catch (e) {
          // If parsing fails, return default
        }
      }
    }
    return {
      date: getDayAfterTomorrow(),
      timeSlot: "9:00 - 15:00",
      intervalType: "6hours",
    };
  };

  const [materialsDelivery, setMaterialsDeliveryState] = useState<ScheduleData>(loadSavedMaterialsDelivery());
  const [collectionDate, setCollectionDateState] = useState<ScheduleData>(loadSavedCollectionDate());

  // Wrapper functions to save to localStorage
  const setMaterialsDelivery = (data: ScheduleData) => {
    setMaterialsDeliveryState(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("step5_materialsDelivery", JSON.stringify(data));
    }
  };

  const setCollectionDate = (data: ScheduleData) => {
    setCollectionDateState(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("step5_collectionDate", JSON.stringify(data));
    }
  };

  // Helper function to format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to get minimum date (today) for date input
  const getMinDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  // Inventory list structure (same as Step2, Step3, and Step4)
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


  const sixHourSlots = ["9:00 - 15:00", "12:00 - 18:00", "17:00 - 23:00"];
  const twoHourSlots = [
    "9:00 - 11:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "13:00 - 15:00",
    "14:00 - 16:00",
    "15:00 - 17:00",
    "17:00 - 19:00",
    "18:00 - 20:00",
    "19:00 - 21:00",
    "20:00 - 22:00",
    "21:00 - 23:00",
  ];

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const renderTimeSlots = (
    schedule: ScheduleData,
    setSchedule: (data: ScheduleData) => void
  ) => {
    return (
      <div className="flex-1">
        {/* 6 Hours Interval */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">6 hours interval</h4>
          <div className="flex flex-wrap gap-2">
            {sixHourSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSchedule({ ...schedule, timeSlot: slot, intervalType: "6hours" })}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                  schedule.intervalType === "6hours" && schedule.timeSlot === slot
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* 2 Hours Interval */}
        {/* <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xs font-semibold text-gray-900">2 hours interval</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {twoHourSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSchedule({ ...schedule, timeSlot: slot, intervalType: "2hours" })}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                  schedule.intervalType === "2hours" && schedule.timeSlot === slot
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div> */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar - Quote Summary */}
        <div className="w-full lg:w-64 bg-white border border-gray-200 p-4 flex flex-col rounded-lg shadow-sm order-1 lg:order-1">
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
                <span>Step 5 of 6</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full transition-all"
                  style={{ width: "83.33%" }}
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
          <div className="text-xs text-gray-600 mb-2">
            <span className="font-semibold">No Surprises Guarantee</span> We'll complete the job, no matter
            how long it takes — at no extra charge — As long as the items, access, and dismantling info
            are accurate.
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 italic">*Extra charges may apply for undeclared items.</p>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-3 sm:p-4 max-w-3xl overflow-y-auto max-h-[85vh] order-2 lg:order-2">
          {/* Materials Delivery Section */}
          {/* <div className="mb-6">
            <div className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
              Materials delivery
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Our materials delivery will arrive on{" "}
              <span className="text-orange-500 block sm:inline">
                {materialsDelivery.date ? formatDate(materialsDelivery.date) : "Select a date"}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-900 mb-4">
              between <span className="text-orange-500">{materialsDelivery.timeSlot}</span>.
            </p>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={formatDateForInput(materialsDelivery.date)}
                  onChange={(e) => {
                    const selectedDate = e.target.value ? new Date(e.target.value) : null;
                    setMaterialsDelivery({ ...materialsDelivery, date: selectedDate });
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>
              {renderTimeSlots(materialsDelivery, setMaterialsDelivery)}
            </div>
          </div> */}

          {/* Divider */}
          {/* <hr className="border-gray-200 my-6" /> */}

          {/* Collection Date Section */}
          <div className="mb-6">
            <div className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
              Collection Date
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Our movers will arrive on{" "}
              <span className="text-orange-500 block sm:inline">
                {collectionDate.date ? formatDate(collectionDate.date) : "Select a date"}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-900 mb-4">
              between <span className="text-orange-500">{collectionDate.timeSlot}</span>.
            </p>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Date Picker */}
              <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={formatDateForInput(collectionDate.date)}
                  onChange={(e) => {
                    const selectedDate = e.target.value ? new Date(e.target.value) : null;
                    setCollectionDate({ ...collectionDate, date: selectedDate });
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>
              {renderTimeSlots(collectionDate, setCollectionDate)}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={onPrevious}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <button
              type="button"
              onClick={onContinue}
              disabled={!materialsDelivery.date || !collectionDate.date}
              className={`px-4 sm:px-6 py-2 text-sm rounded-lg font-semibold shadow-lg transition-all ${
                materialsDelivery.date && collectionDate.date
                  ? "bg-orange-500 text-white hover:bg-orange-600"
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

