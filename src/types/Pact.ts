import type { School } from "./School";

export type Pact = {
    id: string;
    name: string;
    municipality: string[];
    coordinates?: [number, number];
    schools: School[];
    studentCount: number;
    parentCount: number;
    contact?: string;
  };