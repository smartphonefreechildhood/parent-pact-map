import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const SwedenMapMaskLayer = () => {
  const map = useMap();

  useEffect(() => {
    fetch("/swedengeo.json")
      .then((res) => res.json())
      .then((swedenGeoJson) => {
        const boundaryLayer = new (L as any).TileLayer.BoundaryCanvas(
          "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
          {
            boundary: swedenGeoJson,
            attribution: `&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors`,
            maskColor: "rgb(26 23 48)",
          }
        );

        boundaryLayer.addTo(map);
        const bounds = L.geoJSON(swedenGeoJson).getBounds();
        map.fitBounds(bounds);
      });
  }, [map]);

  return null;
};

export default SwedenMapMaskLayer;
