import { MapPinIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import L from "leaflet";
import "leaflet.heat";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { useCallback, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "../plugins/BoundaryCanvas";
import type { Pact } from "../types/Pact";
import type { School } from "../types/School";
import ClusterMarkers from "./ClusterMarkers";
import HeatmapLayer from "./HeatmapLayer";
import List from "./List";
import Pill from "./Pill";
import SearchBar from "./SearchBar";
import VisibleMarkerTracker from "./VisibleMarkerTracker";
import ZoomStartListener from "./ZoomStartListener";
import SearchInfo from "./SearchInfo";
import useIsMobileView from "../hooks/useIsMobileView";
import { logInfo } from "../util/log";

// Extend Leaflet namespace to include markerClusterGroup
declare module "leaflet" {
  function markerClusterGroup(options?: any): any;
}

interface MapProps {
  pacts: Pact[];
}

function Map({ pacts }: MapProps) {
  const mapRef = useRef<L.Map>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<
    [School, [number, number]][]
  >([]);
  const [searchQuery, setSearchQuery] = useState<[number, number] | null>(null);
  const [zooming, setZooming] = useState(false);
  const [closestPacts, setClosestPacts] = useState<Pact[]>([]);

  const isMobile = useIsMobileView();

  // Extract all schools from all pacts for both heatmap and markers
  const allSchools = pacts.flatMap((pact) =>
    pact.schools
      .filter((school) => school.coordinates)
      .map((school) => ({ ...school, pact }))
  );

  const heatPoints: [number, number, number?][] = allSchools.map((school) => [
    school.coordinates[0],
    school.coordinates[1],
    school.studentCount, // Use school's student count for heatmap intensity
  ]);

  const markerPoints: [School, [number, number]][] = allSchools.map(
    (school) => {
      return [school, [school.coordinates[0], school.coordinates[1]]];
    }
  );

  const handleSearch = (coords: [number, number]) => {
    const map = mapRef.current;

    if (map) {
      map.setView(coords, 12); // zoom to the searched location
      setSearchQuery(coords);
    }
  };

  const handleZooming = () => {
    setZooming(true);
    setClosestPacts([]);
  };

  const mapContainerClass = classNames(
    "w-full md:w-1/2 z-10 relative rounded-t-lg overflow-hidden",
    {
      "h-[50vh] md:h-[100vh]": searchQuery || zooming,
      "h-full": !searchQuery,
    }
  );

  const listClass = classNames(
    "w-full overflow-y-scroll bg-inherit pointer-events-auto border border-primary rounded-b-lg md:hidden",
    {
      "h-[50vh] md:h-[100vh]": searchQuery || zooming,
      "h-[25vh] md:h-[100vh]": !searchQuery && !zooming,
    }
  );

  const getClosestPacts = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      // Calculate distance between two points using Haversine formula
      const calculateDistance = (
        lat1: number,
        lng1: number,
        lat2: number,
        lng2: number
      ): number => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      // Calculate distances for all pacts and sort by closest
      const pactsWithDistances = pacts.map((pact) => {
        let minDistance = Infinity;
        let closestSchool = null;

        // Find the closest school in this pact to the user
        pact.schools.forEach((school) => {
          const distance = calculateDistance(
            userLat,
            userLng,
            school.coordinates[0],
            school.coordinates[1]
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestSchool = school;
          }
        });

        return { pact, distance: minDistance, closestSchool };
      });

      // Sort by distance and take the closest 3
      const closest3Pacts = pactsWithDistances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map((item) => item.pact);

      const mainPact = closest3Pacts[0];
      const map = mapRef.current;

      const closestSchool = pactsWithDistances.find(
        (pact) => pact.pact.id === mainPact.id
      )?.closestSchool as School | null;

      if (map) {
        map.setView(
          [
            closestSchool?.coordinates[0] ?? 0,
            closestSchool?.coordinates[1] ?? 0,
          ],
          isMobile ? 11 : 12
        );
      }

      logInfo("Closest 3 pacts:", closest3Pacts);
      logInfo("Closest school:", closestSchool);
      setClosestPacts(closest3Pacts);
    });
  }, [pacts]);

  // Filter pacts based on visible markers' pactIds
  const visiblePactIds = new Set(
    visibleMarkers.map(([school]) => school.pactId)
  );
  const filteredPacts = pacts.filter((pact) => visiblePactIds.has(pact.id));

  const searchInfoDescription =
    searchQuery || zooming
      ? closestPacts.length > 0
        ? `Visar de ${closestPacts.length} pakter som är närmast dig.`
        : `Visar ${filteredPacts.length} pakter.`
      : "Visar alla pakter. Sök efter stad, skola eller kommun för att hitta pakter nära dig.";

  return (
    <div className="flex h-full relative">
      <div className="flex flex-1 flex-col md:flex-row w-full md:w-1/2 p-4 md:p-0 ">
        <div className="w-full md:w-1/2 md:overflow-y-scroll">
          <div className="md:px-2">
            <h3 className="text-base font-semibold py-1">
              Sök i kartan <span className="font-light">(ettikett input)</span>
            </h3>
          </div>
          <div>
            <div className="w-full flex-1 md:flex-none flex flex-col md:p-2">
              <SearchBar onSearch={handleSearch} />
              <div className="flex py-2 pointer-events-auto">
                <button
                  className="hover:bg-transparent"
                  onClick={getClosestPacts}
                >
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
              description={
                searchQuery || zooming
                  ? closestPacts.length > 0
                    ? `Visar de ${closestPacts.length} pakter som är närmast dig.`
                    : `Visar ${filteredPacts.length} pakter.`
                  : "Visar alla pakter. Sök efter stad, skola eller kommun för att hitta pakter nära dig."
              }
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
        <div className={mapContainerClass}>
          <MapContainer
            center={[62.0, 10.0]} // Centered over Sweden
            zoom={isMobile ? 4 : 5}
            maxBounds={[
              [54.5, 7.5],
              [69.5, 25.5],
            ]} // Rough bounding box for Sweden
            minZoom={4}
            maxZoom={15}
            maxBoundsViscosity={1.0}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors &amp; Geoapify"
              url="https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=c7be631f429d488f953709566022593d"
            />
            <HeatmapLayer points={heatPoints} />
            <ClusterMarkers coordinates={markerPoints} />
            <VisibleMarkerTracker
              allMarkers={markerPoints}
              onVisibleChange={setVisibleMarkers}
            />
            <ZoomStartListener onZoomStart={handleZooming} />
          </MapContainer>
        </div>
        <div className={listClass}>
          <SearchInfo
            title="Sökresultat"
            description={filteredPacts.length > 0 ? searchInfoDescription : ""}
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
    </div>
  );
}

export default Map;
