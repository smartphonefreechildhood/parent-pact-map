
export type Pact = {
    id: string;
    name: string;
    municipality: string[];
    coordinates: [number, number];
    // TODO: Add schools back in when data is available
    // schools: School[];
    studentCount: number;
    parentCount: number;
    contact?: string;
  };