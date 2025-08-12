import type { Suggestion } from '../types/SearchTypes';

export const resolveSuggestionToCoords = async (
  s: Suggestion
): Promise<[number, number] | null> => {
  const place = s.placePrediction.toPlace();
  await place.fetchFields({
    fields: ["location", "formattedAddress", "displayName"],
  });
  const loc: any = place.location;
  if (!loc) return null;
  const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
  const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
  return [lat, lng];
};

export const geocodeAddress = async (
  address: string,
  geocoder: google.maps.Geocoder | null
): Promise<[number, number] | null> => {
  if (!geocoder) return null;

  return new Promise((resolve) => {
    geocoder.geocode(
      { address, componentRestrictions: { country: "se" } },
      (results, status) => {
        if (status === "OK" && results?.[0]) {
          const loc = results[0].geometry.location;
          resolve([loc.lat(), loc.lng()]);
        } else {
          resolve(null);
        }
      }
    );
  });
}; 