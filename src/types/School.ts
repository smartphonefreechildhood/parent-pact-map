import type { Pact } from "./Pact";

export type School = {
    name: string;
    schoolYears: Record<string, number>;
    coordinates: [number, number];
    contact?: string;
    studentCount: number;
    parentCount: number;
    pactId: string;
    pact?: Pact;
  };