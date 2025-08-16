import { useMapEvent } from "react-leaflet";

const ZoomStartListener = ({ onZoomStart }: { onZoomStart: () => void }) => {
  useMapEvent("zoomstart", (e) => {
    onZoomStart();
  });
  return null;
};

export default ZoomStartListener;
