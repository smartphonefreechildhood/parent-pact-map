import { useMemo } from "react";
import type { Pact } from "../types/Pact";
import type { School } from "../types/School";

export function useMapData(pacts: Pact[]) {
  const allSchools = useMemo(() => 
    pacts.flatMap((pact) =>
      pact.schools
        .filter((school) => school.coordinates)
        .map((school) => ({ ...school, pact }))
    ), [pacts]);

  const heatPoints = useMemo(() => 
    allSchools.map((school) => [
      school.coordinates[0],
      school.coordinates[1],
      school.studentCount,
    ] as [number, number, number]), [allSchools]);

  const markerPoints = useMemo(() => 
    allSchools.map((school) => [
      school, 
      [school.coordinates[0], school.coordinates[1]]
    ] as [School, [number, number]]), [allSchools]);

  return {
    allSchools,
    heatPoints,
    markerPoints,
  };
} 