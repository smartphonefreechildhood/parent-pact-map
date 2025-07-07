export type Pact = {
    firstName?: string;
    lastName?: string;
    email?: string;
    municipality: string;
    school: string;
    schoolYears: Record<string, number>;
    coordinates: [number, number];
    contact?: string;
    size: number;
    count: number;
  };