import { useMemo } from "react";
import data from "../scripts/pacts.json";
import type { Pact } from "../types/Pact";

function mapDataToPacts(data: any) : Pact[] {
  return data.map((item: any) => ({
    ...item,
  }));
}

function usePacts(): { pacts: Pact[] } {
  const pacts = useMemo(() => {
    return mapDataToPacts(data);
  }, []);

  return { pacts };
}

export default usePacts;