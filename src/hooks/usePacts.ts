import { useMemo } from "react";
import data from "../scripts/grouped_with_coordinates.json";
import type { Pact } from "../types/Pact";

// Helper function to generate a size based on school years
function generateSize(maxCount: number, count: number): number {
  return count / maxCount;
}

// Main function to map form data to pact objects
function mapDataToPacts(formData: any): Pact[] {
  const pacts: Pact[] = [];

  const maxCount = Math.max(...formData.map((submission: any) => submission.count));

  // Process each submission
  formData?.forEach((submission: any) => {
    const { municipality, school, schoolYears, coordinates, whatsapp_urls, count} = submission;

    // Only create a pact if we have the essential information
    if (municipality && school && schoolYears) {
      const size = generateSize(maxCount, submission.count);

      const pact: Pact = {
        municipality,
        school,
        schoolYears,
        coordinates,
        size,
        count,
        contact: whatsapp_urls[0] || undefined,
      };

      pacts.push(pact);
    }
  });

  return pacts;
}

function usePacts() {
  const pacts = useMemo(() => {
    return mapDataToPacts(data);
  }, []);

  return { pacts };
}

export default usePacts;