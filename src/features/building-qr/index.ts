export { BuildingQrScreen } from './components/BuildingQrScreen';
export { QrCanvas } from './components/QrCanvas';
export { RenderViewport, type RenderViewportHandle } from './components/RenderViewport';
export { ScanReliabilityPanel } from './components/ScanReliabilityPanel';
export { ExportPanel } from './components/ExportPanel';
export { PresetSelector } from './components/PresetSelector';
export { useBuildingQrStore } from './store/buildingQrStore';
export type { BuildingQrState, ViewMode } from './store/buildingQrStore';
export { useQrMatrix } from './hooks/useQrMatrix';
export type { UseQrMatrixResult } from './hooks/useQrMatrix';
export {
  qrLayout,
  drawQrToCanvas,
  qrToPngBlob,
  moduleSizeForResolution,
  SCAN_COLORS,
  type Qr2dOptions,
  type QrLayout,
} from './render2d/renderQrToCanvas';
export { drawColoredQrToCanvas, coloredQrToPngBlob } from './render2d/renderColoredQr';
export { ViewSwitch } from './components/ViewSwitch';
export * from './qr';
export * from './art';
// NOTE: ./render (Three.js) is intentionally NOT re-exported here — it is loaded
// on demand via a dynamic import in RenderViewport to keep it out of the initial
// bundle. Import from './render/*' directly if needed internally.
