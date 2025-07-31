import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import swedenGeoJson from "../../public/swedengeo2.json"; // adjust path

function SwedenMapMaskLayer2() {
  const map = useMap();

  useEffect(() => {
    const outer: L.LatLngTuple[] = [
      [90, -180],
      [90, 180],
      [-90, 180],
      [-90, -180],
      [90, -180],
    ];
    const maskLayer = L.geoJSON(swedenGeoJson as any, {
      // Construct a single polygon with holes
      filter: () => true,
      coordsToLatLng: (coords) =>
        ({ lat: coords[1], lng: coords[0] } as L.LatLng),
      style: () => ({
        fillColor: "#000",
        fillOpacity: 0.6,
        weight: 0,
        interactive: false,
      }),
      onEachFeature: () => {
        // Nothing needed
      },
    });

    // Flatten all Sweden polygons to rings
    const rings: L.LatLngLiteral[][] = [];
    maskLayer.eachLayer((lyr: any) => {
      if (lyr.getLatLngs) {
        const latlngs = lyr.getLatLngs() as any;
        // Geometries may be [ [ring], [hole?] ] or for MultiPolygon several sets
        const extractRings = (arr: any[]) =>
          arr.forEach((el) => {
            if (Array.isArray(el[0])) extractRings(el);
            else rings.push(el.map((c: any) => ({ lat: c.lat, lng: c.lng })));
          });
        extractRings(latlngs);
      }
    });

    const allRings = [outer, ...rings];
    const finalMask = L.polygon(allRings, {
      color: "#1a1730",
      fillColor: "#1a1730",
      fillOpacity: 1,
      weight: 0,
      interactive: false,
    }).addTo(map);

    return () => {
      map.removeLayer(finalMask);
    };
  }, [map]);

  return null;
}

export default SwedenMapMaskLayer2;
