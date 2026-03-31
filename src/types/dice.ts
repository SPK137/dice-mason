export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100' | 'fudge';

export type MaterialPreset =
  | 'matte-plastic'
  // | 'gloss-resin'
  | 'metallic'
  // | 'stone'
  // | 'glow'
  // | 'wood'
  // | 'holographic'
  | 'glass';

export interface MaterialConfig {
  preset: MaterialPreset;
  bodyColor: string;
  secondaryColor?: string;
  faceColor: string;
  edgeColor?: string;
  roughness: number;
  metalness: number;
  transmission?: number;     // for translucency
  emissive?: string;         // for glow effect
}

export interface FaceConfig {
  faceIndex: number;
  resultValue: number | string;
  label: string;
  labelColor: string;
  labelFont: string;
  icon?: string;             // SVG string
  backgroundColor?: string;
  isHighlighted: boolean;
  highlightColor?: string;
}

export interface PhysicsConfig {
  size: number;              // scale factor
  mass: number;
  restitution: number;       // bounciness 0-1
  friction: number;
  linearDamping: number;
  angularDamping: number;
}

export interface SoundConfig {
  materialPreset: string;
  rollVolume: number;
  landVolume: number;
  customRollSound?: string;
  customLandSound?: string;
}

export interface FaceStyle {
  labelColor: string;
  labelFont: string;
  backgroundColor?: string;
}

export interface DieConfig {
  id: string;
  type: DieType;
  material: MaterialConfig;
  physics: PhysicsConfig;
  sound: SoundConfig;
  globalFaceStyle: FaceStyle;
  faceOverrides: FaceConfig[];
}

export interface TrayConfig {
  surfaceTexture: string;
  surfaceColor: string;
  lightingMood: 'warm' | 'cool' | 'bright' | 'dramatic';
  cameraAngle: 'top-down' | 'angled' | 'dramatic';
}

export interface SoundSetConfig {
  masterVolume: number;
  naturalTwentySound?: string;
  naturalOneSound?: string;
}

export interface DiceSet {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  dice: DieConfig[];
  trayConfig: TrayConfig;
  soundConfig: SoundSetConfig;
  tags: string[];
  createdAt: string;
  authorName?: string;
  clonedFromId?: string;
}