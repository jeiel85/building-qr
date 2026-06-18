import type { BlockType } from './blockTypes';

export interface Palette {
  background: string;
  ground: string[];
  road: string[];
  building: string[];
  tower: string[];
  park: string[];
  finder: string;
  scanDark: string;
  scanLight: string;
}

export const DEFAULT_PALETTE_ID = 'dusk-city';

export const PALETTES: Record<string, Palette> = {
  'dusk-city': {
    background: '#1d1450',
    ground: ['#241d52', '#2b2364'],
    road: ['#2f2769', '#352b75'],
    building: ['#3b5bdb', '#1c7ed6', '#1098ad', '#4263eb', '#1971c2'],
    tower: ['#7048e8', '#9b8cff', '#6741d9'],
    park: ['#0ca678', '#2f9e44'],
    finder: '#f59f00',
    scanDark: '#000000',
    scanLight: '#ffffff',
  },
  'mono-noir': {
    background: '#0b1020',
    ground: ['#141b30', '#1a2238'],
    road: ['#1f2840', '#243150'],
    building: ['#3b4a6b', '#4a5d86', '#2f3c59', '#586b96'],
    tower: ['#7c8db8', '#9fb0d8'],
    park: ['#2b6cb0', '#3182ce'],
    finder: '#e2e8f0',
    scanDark: '#000000',
    scanLight: '#ffffff',
  },
  sunrise: {
    background: '#2a1530',
    ground: ['#3a2030', '#45283a'],
    road: ['#4a2c3e', '#52334a'],
    building: ['#e8590c', '#f08c00', '#d9480f', '#fd7e14', '#e67700'],
    tower: ['#f783ac', '#e64980', '#d6336c'],
    park: ['#74b816', '#66a80f'],
    finder: '#ffd43b',
    scanDark: '#000000',
    scanLight: '#ffffff',
  },
};

export function getPalette(id: string): Palette {
  return PALETTES[id] ?? PALETTES[DEFAULT_PALETTE_ID];
}

/** Candidate colors for a block type (colorVariant indexes into this). */
export function colorsForType(palette: Palette, type: BlockType): string[] {
  switch (type) {
    case 'ground':
      return palette.ground;
    case 'road':
      return palette.road;
    case 'building':
      return palette.building;
    case 'tower':
      return palette.tower;
    case 'park':
      return palette.park;
    case 'finderTower':
      return [palette.finder];
  }
}
