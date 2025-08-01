import classNames from "classnames";
import L from "leaflet";
import "leaflet.heat";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { useCallback, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import useIsMobileView from "../hooks/useIsMobileView";
import { useMapData } from "../hooks/useMapData";
import "../plugins/BoundaryCanvas";
import type { Pact } from "../types/Pact";
import MapContainer from "./MapContainer";
import MapSidebar from "./MapSidebar";
import MobileList from "./MobileList";

// Extend Leaflet namespace to include markerClusterGroup
declare module "leaflet" {
  function markerClusterGroup(options?: any): any;
}

interface MapProps {
  pacts: Pact[];
}

function Map({ pacts }: MapProps) {
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<
    [Pact, [number, number]][]
  >([]);
  const [searchQuery, setSearchQuery] = useState<[number, number] | null>(null);
  const [zooming, setZooming] = useState(false);
  const [closestPacts, setClosestPacts] = useState<Pact[]>([]);

  const isMobile = useIsMobileView();
  const { heatPoints, markerPoints } = useMapData(pacts);
  const { findClosestPacts } = useGeolocation();

  const handleSearch = (coords: [number, number]) => {
    if (mapRef) {
      mapRef.setView(coords, 12); // zoom to the searched location
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
      "h-full": !searchQuery && !zooming,
    }
  );

  const getClosestPacts = useCallback(() => {
    console.log("getClosestPacts called, mapRef:", mapRef);

    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const { pacts: closestPacts, closestSchool } = findClosestPacts(
        pacts,
        userLat,
        userLng,
        3,
        80
      );

      if (mapRef && closestSchool) {
        mapRef.setView(
          [closestSchool.coordinates[0], closestSchool.coordinates[1]],
          isMobile ? 11 : 12
        );
      } else if (mapRef) {
        mapRef.setView([userLat, userLng], isMobile ? 11 : 12);
      }

      setClosestPacts(closestPacts);
    });
  }, [pacts, findClosestPacts, isMobile, mapRef]);

  // Filter pacts based on visible markers' pactIds
  const visiblePactIds = new Set(visibleMarkers.map(([pact]) => pact.id));
  const filteredPacts = pacts.filter((pact) => visiblePactIds.has(pact.id));

  return (
    <div className="flex h-full relative">
      <div className="flex flex-1 flex-col md:flex-row w-full md:w-1/2 p-4 md:p-0">
        <MapSidebar
          onSearch={handleSearch}
          onFindClosest={getClosestPacts}
          searchQuery={searchQuery}
          zooming={zooming}
          closestPacts={closestPacts}
          filteredPacts={filteredPacts}
        />

        <div className={mapContainerClass}>
          <MapContainer
            heatPoints={heatPoints}
            markerPoints={markerPoints}
            onVisibleChange={setVisibleMarkers}
            onZoomStart={handleZooming}
            onMapRef={setMapRef}
            isMobile={isMobile}
          />
        </div>

        <MobileList
          searchQuery={searchQuery}
          zooming={zooming}
          closestPacts={closestPacts}
          filteredPacts={filteredPacts}
        />
      </div>
    </div>
  );
}

export default Map;
