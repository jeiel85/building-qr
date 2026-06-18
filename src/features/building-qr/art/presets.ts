/** Art presets — tune the skyline silhouette and palette. */
export interface ArtPreset {
  id: string;
  name: string;
  description: string;
  paletteId: string;
  /** Floors for ordinary mid-rise buildings. */
  maxBuildingHeight: number;
  /** Extra floors a downtown tower can gain. */
  towerHeightBoost: number;
  /** Uniform height for finder-pattern landmark towers. */
  finderTowerHeight: number;
  /** Chance an outer dark module becomes a low park instead of a building. */
  parkChance: number;
  /** Fraction of the max radius treated as "downtown" (taller towers). */
  centerRadiusFactor: number;
  scanSafe: boolean;
}

export const DEFAULT_PRESET_ID = 'dusk-city';

export const PRESETS: Record<string, ArtPreset> = {
  'dusk-city': {
    id: 'dusk-city',
    name: '황혼 도시',
    description: '보랏빛 황혼의 빌딩숲',
    paletteId: 'dusk-city',
    maxBuildingHeight: 4,
    towerHeightBoost: 3,
    finderTowerHeight: 3,
    parkChance: 0.12,
    centerRadiusFactor: 0.42,
    scanSafe: true,
  },
  'mono-noir': {
    id: 'mono-noir',
    name: '느와르 야경',
    description: '푸른 밤의 단색 도시',
    paletteId: 'mono-noir',
    maxBuildingHeight: 5,
    towerHeightBoost: 4,
    finderTowerHeight: 3,
    parkChance: 0.08,
    centerRadiusFactor: 0.4,
    scanSafe: true,
  },
  sunrise: {
    id: 'sunrise',
    name: '노을 도시',
    description: '따뜻한 노을빛 스카이라인',
    paletteId: 'sunrise',
    maxBuildingHeight: 4,
    towerHeightBoost: 3,
    finderTowerHeight: 3,
    parkChance: 0.15,
    centerRadiusFactor: 0.45,
    scanSafe: true,
  },
};

export const PRESET_LIST: ArtPreset[] = Object.values(PRESETS);

export function getPreset(id: string): ArtPreset {
  return PRESETS[id] ?? PRESETS[DEFAULT_PRESET_ID];
}
