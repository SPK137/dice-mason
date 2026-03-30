import { DeviceTier } from "@/hooks/useMobile";

export interface RenderConfig {
  isMobile: boolean;
  // Geometry detail
  boxSegments: number;          // d6 face subdivisions
  shadowMapSize: number;        // shadow resolution
  // Physics
  physicsFps: number;           // physics step rate
}

const configs: Record<DeviceTier, RenderConfig> = {
  mobile: {
    isMobile: true,
    boxSegments: 1,
    shadowMapSize: 2048,
    physicsFps: 30
  },
  tablet: {
    isMobile: true,
    boxSegments: 1,
    shadowMapSize: 2048,
    physicsFps: 45
  },
  desktop: {
    isMobile: false,
    boxSegments: 2,
    shadowMapSize: 2048,
    physicsFps: 60
  },
};

export function getRenderConfig(tier: DeviceTier): RenderConfig {
  return configs[tier];
}