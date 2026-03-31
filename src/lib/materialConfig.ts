import { MaterialConfig, MaterialPreset } from "@/types/dice";

const configs: Record<MaterialPreset, MaterialConfig> = {
  "matte-plastic": {
    preset: "matte-plastic",
    bodyColor: "", // TODO: integrate body color config
    faceColor: "", // TODO: integrate face color config
    roughness: 0.4,
    metalness: 0.1,
    transmission: 0,     // for translucency
  },
  metallic: {
    preset: "metallic",
    bodyColor: "", // TODO: integrate body color config
    faceColor: "", // TODO: integrate face color config
    roughness: 0.2,
    metalness: 0.6,
    transmission: 0,     // for translucency
  },
  glass: {
    preset: "glass",
    bodyColor: "", // TODO: integrate body color config
    faceColor: "", // TODO: integrate face color config
    roughness: 0.3,
    metalness: 0.75,
    transmission: 0.45,     // for translucency
  },
};

export function getMaterialConfig(material: MaterialPreset): MaterialConfig {
  return configs[material];
}