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
import type { LocationInfo } from "../util/searchUtils";
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
  const [currentLocationInfo, setCurrentLocationInfo] = useState<
    LocationInfo | undefined
  >();
  const [isProgrammaticZoom, setIsProgrammaticZoom] = useState(false);

  const isMobile = useIsMobileView();
  const { heatPoints, markerPoints } = useMapData(pacts);
  const { findClosestPacts } = useGeolocation();

  const setMapViewWithLayoutDelay = useCallback(
    (
      coords: [number, number],
      triggerStateChange: () => void,
      afterLayoutChange?: () => void
    ) => {
      if (mapRef) {
        triggerStateChange();

        setTimeout(() => {
          if (mapRef) {
            setIsProgrammaticZoom(true); // Set flag before programmatic zoom
            mapRef.invalidateSize();
            mapRef.setView(coords, isMobile ? 11 : 12);
            afterLayoutChange?.();
          }
        }, 100);
      }
    },
    [mapRef, isMobile]
  );

  const handleSearch = (locationInfo: LocationInfo) => {
    setMapViewWithLayoutDelay(locationInfo.coordinates, () => {
      setSearchQuery(locationInfo.coordinates);
      setCurrentLocationInfo(locationInfo);
      setClosestPacts([]);
    });
  };

  const handleZooming = () => {
    if (isProgrammaticZoom) {
      setCurrentLocationInfo(undefined);
      setIsProgrammaticZoom(false);
    }

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

      const targetCoords = closestSchool
        ? ([closestSchool.coordinates[0], closestSchool.coordinates[1]] as [
            number,
            number
          ])
        : ([userLat, userLng] as [number, number]);

      setMapViewWithLayoutDelay(
        targetCoords,
        () => {
          setZooming(true);
        },
        () => setClosestPacts(closestPacts)
      );
    });
  }, [pacts, findClosestPacts, setMapViewWithLayoutDelay]);

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
          currentLocationInfo={currentLocationInfo}
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
