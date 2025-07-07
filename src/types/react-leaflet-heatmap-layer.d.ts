declare module 'react-leaflet-heatmap-layer' {
  import { Component } from 'react';

  interface HeatmapLayerProps {
    points: number[][];
    longitudeExtractor: (point: any) => number;
    latitudeExtractor: (point: any) => number;
    intensityExtractor: (point: any) => number;
    radius?: number;
    blur?: number;
    max?: number;
    minOpacity?: number;
    fitBoundsOnLoad?: boolean;
    fitBoundsOnUpdate?: boolean;
  }

  export class HeatmapLayer extends Component<HeatmapLayerProps> {}
} 