/// <reference path="../types/google-maps.d.ts" />
import { useEffect, useRef } from "react";
import { loadGoogleMapsJs } from "../util/googleMapsLoader";

export const useGoogleMapsInit = (apiKey?: string) => {
  const geocoderRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await loadGoogleMapsJs(apiKey);
      if (cancelled) return;

      geocoderRef.current = new google.maps.Geocoder();
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    })().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  return { geocoderRef, sessionTokenRef };
}; 