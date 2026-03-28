import * as THREE from "three";

export interface FaceTextureOptions {
  value: string;
  backgroundColor: string;
  textColor: string;
  font?: string;
  size?: number;
}

export function createFaceTexture(options: FaceTextureOptions): THREE.CanvasTexture {
  const {
    value,
    backgroundColor,
    textColor,
    font = "Cinzel",
    size = 256,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Rounded rect border
  const padding = size * 0.06;
  const radius = size * 0.12;
  ctx.strokeStyle = textColor;
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.roundRect(padding, padding, size - padding * 2, size - padding * 2, radius);
  ctx.stroke();

  // Number
  const fontSize = size * 0.52;
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px ${font}, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Underline 6 and 9 to disambiguate
  
  if (value === "6" || value === "9") {
    ctx.fillText(value, size / 2, size / 2);
    const textWidth = ctx.measureText(value).width;
    const underlineY = size / 2 + fontSize * 0.38;
    ctx.beginPath();
    ctx.moveTo(size / 2 - textWidth / 2, underlineY);
    ctx.lineTo(size / 2 + textWidth / 2, underlineY);
    ctx.lineWidth = size * 0.035;
    ctx.strokeStyle = textColor;
    ctx.stroke();
  } else {
    ctx.fillText(value, size / 2, size / 2 + size * 0.05);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Generate all 6 face textures for a d6
export function createD6Textures(
  bodyColor: string = "#7C5CEF",
  textColor: string = "#F0EEF8"
): THREE.CanvasTexture[] {
  // Three.js BoxGeometry face order:
  // 0: +X (right) = 2
  // 1: -X (left)  = 5
  // 2: +Y (top)   = 1
  // 3: -Y (bottom)= 6
  // 4: +Z (front) = 3
  // 5: -Z (back)  = 4
  const faceValues = ["2", "5", "1", "6", "3", "4"];

  return faceValues.map((value) =>
    createFaceTexture({ value, backgroundColor: bodyColor, textColor })
  );
}