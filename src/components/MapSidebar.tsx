import { MapPinIcon } from "@heroicons/react/24/outline";
import type { Pact } from "../types/Pact";
import List from "./List";
import Pill from "./Pill";
import Search from "./Search";
import SearchInfo from "./SearchInfo";
import { config } from "../config/env";

interface MapSidebarProps {
  onSearch: (coords: [number, number]) => void;
  onFindClosest: () => void;
  searchQuery: [number, number] | null;
  zooming: boolean;
  closestPacts: Pact[];
  filteredPacts: Pact[];
}

export default function MapSidebar({
  onSearch,
  onFindClosest,
  searchQuery,
  zooming,
  closestPacts,
  filteredPacts,
}: MapSidebarProps) {
  const searchInfoDescription =
    searchQuery || zooming
      ? closestPacts.length > 0
        ? `Visar de ${closestPacts.length} pakter som är närmast dig.`
        : `Visar ${
            filteredPacts.length > 1
              ? `${filteredPacts.length} pakter`
              : "1 pakt"
          }.`
      : `Visar alla ${filteredPacts.length} pakter i Sverige. Sök efter kommun för att hitta pakter nära dig.`;

  return (
    <div className="w-full md:w-1/2 md:overflow-y-scroll">
      <div className="md:px-2">
        <h3 className="text-base font-semibold py-1">
          Hitta lokala Föräldrapakter
        </h3>
      </div>
      <div>
        <div className="w-full flex-1 md:flex-none flex flex-col md:p-2">
          <Search onSearch={onSearch} apiKey={config.googleApiKey!} />
          <div className="flex py-2 pointer-events-auto">
            <button className="hover:bg-transparent" onClick={onFindClosest}>
              <Pill>
                <MapPinIcon className="w-4 h-4" /> Hitta andra nära mig
              </Pill>
            </button>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <SearchInfo
          title="Sökresultat"
          description={searchInfoDescription}
          fullHeight={!searchQuery && !zooming}
        />
        {searchQuery || zooming ? (
          <List
            filteredPacts={
              closestPacts.length > 0 ? closestPacts : filteredPacts
            }
          />
        ) : null}
      </div>
    </div>
  );
}
