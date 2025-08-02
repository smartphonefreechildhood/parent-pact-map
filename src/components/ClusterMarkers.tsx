import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import type { Pact } from "../types/Pact";

interface ClusterMarkersProps {
  coordinates: [Pact, [number, number]][];
}

export const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function ClusterMarkers({ coordinates }: ClusterMarkersProps) {
  const map = useMap();

  useEffect(() => {
    const markers = L.markerClusterGroup({
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();

        let color = "#808080";

        if (count >= 50) {
          color = "#5e5e5e";
        } else if (count >= 20) {
          color = "#757575";
        }

        return L.divIcon({
          html: `<div class="map-marker-cluster" style="background:${color};">
                       <span>${count}</span>
                     </div>`,
          className: "leaflet-marker-cluster", // required to keep correct positioning
          iconSize: [40, 40],
        });
      },
      showCoverageOnHover: false,
    });
    coordinates.forEach(([school, [lat, lng]]) => {
      const marker = L.marker([lat, lng])
        .setIcon(markerIcon)
        .bindPopup(
          `<div class="text-sm">
          <div>${school.name} (${school.parentCount} föräldrar)</div><div>
           <a href="https://forms.smartphonefreechildhood.se/pakten" target="_blank">Gå med</a>
          </div></div>`
        );
      markers.addLayer(marker);
    });
    map.addLayer(markers);
    return () => {
      map.removeLayer(markers);
    };
  }, [coordinates, map]);

  return null;
}

export default ClusterMarkers;
