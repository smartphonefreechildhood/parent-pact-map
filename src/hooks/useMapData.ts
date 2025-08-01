import { useMemo } from "react";
import type { Pact } from "../types/Pact";

export function useMapData(pacts: Pact[]) {

  const heatPoints = useMemo(() => 
    pacts.map((pact) => [
      pact.coordinates?.[0],
      pact.coordinates?.[1],
      pact.studentCount,
    ] as [number, number, number]), [pacts]);

  const markerPoints = useMemo(() => 
    pacts.map((pact) => [
      pact, 
      [pact.coordinates?.[0], pact.coordinates?.[1]]
    ] as [Pact, [number, number]]), [pacts]);

  return {
    pacts,
    heatPoints,
    markerPoints,
  };
} 

// TODO: Add schools back in when data is available
// export function useMapDataWithSchools(pacts: Pact[]) {
//   const allSchools = useMemo(() => 
//     pacts.flatMap((pact) =>
//       pact.schools
//         .filter((school) => school.coordinates)
//         .map((school) => ({ ...school, pact }))
//     ), [pacts]);

//   const heatPoints = useMemo(() => 
//     allSchools.map((school) => [
//       school.coordinates[0],
//       school.coordinates[1],
//       school.studentCount,
//     ] as [number, number, number]), [allSchools]);

//   const markerPoints = useMemo(() => 
//     allSchools.map((school) => [
//       school, 
//       [school.coordinates[0], school.coordinates[1]]
//     ] as [School, [number, number]]), [allSchools]);

//   return {
//     allSchools,
//     heatPoints,
//     markerPoints,
//   };
// } 