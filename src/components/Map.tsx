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
import ClusterMarkers from "./ClusterMarkers";
import HeatmapLayer from "./HeatmapLayer";
import List from "./List";
import SearchBar from "./SearchBar";
import VisibleMarkerTracker from "./VisibleMarkerTracker";
import Pill from "./Pill";
import { MapPinIcon } from "@heroicons/react/24/outline";

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
    [Pact, [number, number]][]
  >([]);
  const [searchQuery, setSearchQuery] = useState<[number, number] | null>(null);

  const heatPoints: [number, number, number?][] = pacts.map((pact) => [
    pact.coordinates[0],
    pact.coordinates[1],
    pact.size,
  ]);

  const markerPoints: [Pact, [number, number]][] = pacts.map((pact) => {
    return [pact, [pact.coordinates[0], pact.coordinates[1]]];
  });

  const handleSearch = (coords: [number, number]) => {
    const map = mapRef.current;

    if (map) {
      map.setView(coords, 12); // zoom to the searched location
      setSearchQuery(coords);
    }
  };

  const mapContainerClass = classNames("w-full z-10 relative", {
    "h-[50vh] md:h-[100vh]": searchQuery,
    "h-full": !searchQuery,
  });

  const listClass = classNames(
    "w-full overflow-y-scroll bg-white pointer-events-auto",
    {
      "h-[50vh] md:h-[100vh]": searchQuery,
      "hidden md:block": !searchQuery,
    }
  );

  const getCurrentPosition = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const map = mapRef.current;
      if (map) {
        map.setView([position.coords.latitude, position.coords.longitude], 12);
      }
    });
  }, [mapRef]);

  return (
    <div className="flex h-full relative">
      <div className="w-full md:w-1/2 h-full absolute top-0 left-0 z-20 md:relative overflow-y-scroll flex flex-col pointer-events-none">
        <div className="w-full p-4 pl-12 md:p-4 flex-1 md:flex-none flex flex-col">
          <SearchBar onSearch={handleSearch} />
          <div className="flex py-2 pointer-events-auto">
            <button
              className="hover:bg-transparent"
              onClick={getCurrentPosition}
            >
              <Pill>
                <MapPinIcon className="w-4 h-4" /> Hitta skolor nära mig
              </Pill>
            </button>
          </div>
        </div>
        <div className={listClass}>
          <List visibleMarkers={visibleMarkers} />
        </div>
      </div>
      <div className="flex flex-1 flex-col w-full md:w-1/2 ">
        <div className={mapContainerClass}>
          <MapContainer
            center={[62.0, 10.0]} // Centered over Sweden
            zoom={5.2}
            maxBounds={[
              [54.5, 7.5],
              [69.5, 25.5],
            ]} // Rough bounding box for Sweden
            minZoom={5}
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
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Map;
