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

  // Extract all schools from all pacts for both heatmap and markers
  const allSchools = pacts.flatMap((pact) =>
    pact.schools.filter((school) => school.coordinates)
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

  const mapContainerClass = classNames(
    "w-full z-10 relative rounded-t-lg overflow-hidden",
    {
      "h-[50vh] md:h-[100vh]": searchQuery || zooming,
      "h-full": !searchQuery,
    }
  );

  const listClass = classNames(
    "w-full overflow-y-scroll bg-inherit pointer-events-auto border border-primary rounded-b-lg",
    {
      "h-[50vh] md:h-[100vh]": searchQuery || zooming,
      "h-[25vh] md:h-[100vh]": !searchQuery && !zooming,
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

  // Calculate total students from visible markers
  const total = visibleMarkers.reduce(
    (acc, [school]) => acc + school.studentCount,
    0
  );

  // Filter pacts based on visible markers' pactIds
  const visiblePactIds = new Set(
    visibleMarkers.map(([school]) => school.pactId)
  );
  const filteredPacts = pacts.filter((pact) => visiblePactIds.has(pact.id));

  return (
    <div className="flex h-full relative">
      <div className="flex flex-1 flex-col w-full md:w-1/2 p-4 ">
        <div>
          <h3 className="text-base font-semibold py-1">
            Sök i kartan <span className="font-light">(ettikett input)</span>
          </h3>
        </div>
        <div>
          <div className="w-full flex-1 md:flex-none flex flex-col">
            <SearchBar onSearch={handleSearch} />
            <div className="flex py-2 pointer-events-auto">
              <button
                className="hover:bg-transparent"
                onClick={getCurrentPosition}
              >
                <Pill>
                  <MapPinIcon className="w-4 h-4" /> Hitta föräldrar nära mig
                </Pill>
              </button>
            </div>
          </div>
        </div>
        <div className={mapContainerClass}>
          <MapContainer
            center={[62.0, 10.0]} // Centered over Sweden
            zoom={4}
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
            <ZoomStartListener onZoomStart={() => setZooming(true)} />
          </MapContainer>
        </div>
        <div className={listClass}>
          <div className="flex justify-between py-2 px-3 bg-background-secondary">
            <h3 className="font-semibold text-sm">Sökresultat</h3>
            <p className="text-sm font-light">{total} medlemmar</p>
          </div>
          {searchQuery || zooming ? (
            <List filteredPacts={filteredPacts} />
          ) : (
            <div className="p-2">
              <h3 className="text-lg font-medium">
                {markerPoints.length} skolor hittades!
              </h3>
              <p className="text-sm">Zooma in for att se mer information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Map;
