import { useMemo } from "react";
import data from "../scripts/pacts.json";
import type { Pact } from "../types/Pact";

function mapDataToPacts(data: any) : Pact[] {
  return data.map((item: any) => ({
    ...item,
  }));
}

// TODO: Currenlty we retrieve this data from a json file. If data is provided by a an endpoint in the future. This should be changed to call that endpoint.
function usePacts(): { pacts: Pact[] } {
  const pacts = useMemo(() => {
    return mapDataToPacts(data);
  }, []);

  return { pacts };
}

export default usePacts;