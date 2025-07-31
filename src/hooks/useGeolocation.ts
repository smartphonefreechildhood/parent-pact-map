import { useCallback } from "react";
import type { Pact } from "../types/Pact";
import type { School } from "../types/School";
import { logInfo } from "../util/log";

interface GeolocationResult {
  pacts: Pact[];
  closestSchool: School | null;
}

export function useGeolocation() {
  const calculateDistance = useCallback((
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const findClosestPacts = useCallback((
    pacts: Pact[],
    userLat: number,
    userLng: number,
    limit: number = 3
  ): GeolocationResult => {
    const pactsWithDistances = pacts.map((pact) => {
      let minDistance = Infinity;
      let closestSchool = null;

      pact.schools.forEach((school) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          school.coordinates[0],
          school.coordinates[1]
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestSchool = school;
        }
      });

      return { pact, distance: minDistance, closestSchool };
    });

    const closestPacts = pactsWithDistances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map((item) => item.pact);

    const mainPact = closestPacts[0];
    const closestSchool = pactsWithDistances.find(
      (pact) => pact.pact.id === mainPact?.id
    )?.closestSchool as School | null;

    logInfo("Closest pacts:", closestPacts);
    logInfo("Closest school:", closestSchool);

    return { pacts: closestPacts, closestSchool };
  }, [calculateDistance]);

  return {
    findClosestPacts,
  };
} 