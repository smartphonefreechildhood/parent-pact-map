import { useMapEvent } from "react-leaflet";

const ZoomStartListener = ({ onZoomStart }: { onZoomStart: () => void }) => {
  useMapEvent("zoomstart", (_e) => {
    onZoomStart();
  });
  return null;
};

export default ZoomStartListener;
