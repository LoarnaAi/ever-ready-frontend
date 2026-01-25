/** @format */

"use client";

import React, { useEffect, useRef } from "react";

interface AddressAutocompleteProps {
  postcode: string;
  address: string;
  onPostcodeChange: (postcode: string) => void;
  onAddressChange: (address: string) => void;
}

type GooglePlaceAddressComponent = {
  long_name?: string;
  types?: string[];
};

type GooglePlaceResult = {
  formatted_address?: string;
  address_components?: GooglePlaceAddressComponent[];
};

type GoogleAutocompleteInstance = {
  addListener: (eventName: string, handler: () => void) => void;
  getPlace: () => GooglePlaceResult;
};

type GoogleMapsApi = {
  maps?: {
    places?: {
      Autocomplete: new (
        input: HTMLInputElement,
        opts: {
          types: string[];
          componentRestrictions: { country: string };
          fields: string[];
        }
      ) => GoogleAutocompleteInstance;
    };
    event?: {
      clearInstanceListeners: (instance: GoogleAutocompleteInstance) => void;
    };
  };
};

declare global {
  interface Window {
    google: GoogleMapsApi | undefined;
    initGooglePlaces: () => void;
  }
}

export default function AddressAutocomplete({
  postcode,
  address,
  onPostcodeChange,
  onAddressChange,
}: AddressAutocompleteProps) {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleAutocompleteInstance | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

    // Skip if no API key
    if (!apiKey || apiKey === "your_google_places_api_key_here") {
      return;
    }

    // Function to initialize Google Places Autocomplete
    const initAutocomplete = () => {
      if (!window.google?.maps?.places || !addressInputRef.current) {
        return;
      }

      // Clean up existing instance
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }

      // Create new autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
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
          console.log("Selected place:", place);

          // Update address
          onAddressChange(place.formatted_address);

          // Extract postcode from address components
          let postcode = "";

          if (
            place.address_components &&
            Array.isArray(place.address_components)
          ) {
            console.log("Address components:", place.address_components);

            const postcodeComponent = place.address_components.find(
              (component) =>
                component.types &&
                Array.isArray(component.types) &&
                component.types.includes("postal_code")
            );

            if (postcodeComponent?.long_name) {
              postcode = postcodeComponent.long_name;
              console.log("Found postcode from components:", postcode);
            }
          }

          // Fallback: Extract postcode from formatted address using regex
          if (!postcode) {
            console.log("No postcode in components, trying regex extraction");
            const postcodeMatch = place.formatted_address.match(
              /[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i
            );
            if (postcodeMatch) {
              postcode = postcodeMatch[0].toUpperCase();
              console.log("Found postcode from regex:", postcode);
            }
          }

          // Update postcode field if we found one
          if (postcode) {
            console.log("Updating postcode field with:", postcode);
            onPostcodeChange(postcode);
          } else {
            console.log("No postcode found for this address");
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
        setTimeout(initAutocomplete, 100);
      };
      document.head.appendChild(script);
    } else {
      // API already loaded, initialize immediately
      initAutocomplete();
    }

    // Cleanup on unmount
    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [onAddressChange, onPostcodeChange]);

  return (
    <div className="space-y-6">
      {/* Postcode Input */}
      <div>
        <label className="block text-gray-800 font-medium mb-3">
          Postcode *
        </label>
        <input
          type="text"
          value={postcode}
          onChange={(e) => onPostcodeChange(e.target.value)}
          placeholder="Enter postcode (e.g., SW1A 1AA)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Address Input with Autocomplete */}
      <div>
        <label className="block text-gray-800 font-medium mb-3">
          Address *
        </label>
        <input
          ref={addressInputRef}
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Start typing your address..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          autoComplete="off"
        />
      </div>

      {/* API Key Warning */}
      {(!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ===
          "your_google_places_api_key_here") && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="font-medium mb-1">Google Places API Key Required</div>
          <div className="text-xs">
            Please add your Google Places API key to .env.local file
          </div>
        </div>
      )}
    </div>
  );
}
