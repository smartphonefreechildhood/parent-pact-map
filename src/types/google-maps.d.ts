// Global Google Maps API types
declare namespace google {
  namespace maps {
    class Geocoder {
      geocode(
        request: google.maps.GeocoderRequest,
        callback: (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => void
      ): void;
    }

    interface GeocoderRequest {
      address?: string;
      componentRestrictions?: {
        country?: string;
      };
    }

    interface GeocoderResult {
      formatted_address: string;
      geometry: {
        location: google.maps.LatLng;
      };
      address_components: any[];
    }

    enum GeocoderStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR"
    }

    class LatLng {
      lat(): number;
      lng(): number;
    }

    namespace places {
      class AutocompleteSessionToken {}

      class AutocompleteSuggestion {
        static fetchAutocompleteSuggestions(request: any): Promise<{ suggestions: AutocompleteSuggestion[] }>;
        placePrediction?: {
          text: { toString(): string };
          toPlace(): Place;
        };
      }

      class Place {
        fetchFields(options: { fields: string[] }): Promise<void>;
        location?: google.maps.LatLng;
        formattedAddress?: string;
        displayName?: string;
        addressComponents?: any[];
      }
    }
  }
}

declare global {
  interface Window {
    google: typeof google;
    __initGmaps: () => void;
  }

  const google: typeof google;
}

export {}; 