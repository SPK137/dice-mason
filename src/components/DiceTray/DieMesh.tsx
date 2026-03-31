"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { DieGeometryData } from "@/lib/diceGeometry";
import { RenderConfig } from "@/lib/renderConfig";
import { createFaceTexture } from "@/lib/faceTexture";
import { MaterialConfig } from "@/types/dice";

interface DieMeshProps {
  physicsBody: CANNON.Body;
  geometryData: DieGeometryData;
  renderConfig: RenderConfig;
  materialConfig: MaterialConfig
  color?: string;
  faceColor?: string;
}

export default function DieMesh({
  physicsBody,
  geometryData,
  renderConfig,
  materialConfig,
  color = "#7C5CEF",
  faceColor = "#F0EEF8",
}: DieMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    // For multi-material (d6/fudge), one texture per face
    const faceCount = geometryData.faceValues.length;

    if (faceCount <= 6 && geometryData.geometry.type === "BoxGeometry") {
      // D6 / Fudge — multi-material
      const textures = geometryData.faceValues.map((val) =>
        createFaceTexture({
          value: String(val),
          backgroundColor: color,
          textColor: faceColor,
        })
      );
      return textures.map(
        (tex) =>
          new THREE.MeshStandardMaterial({
            map: tex,
            roughness: materialConfig.roughness,
            metalness: materialConfig.metalness,
            opacity: materialConfig.transmission
          })
      );
    }

    // All other dice — single material with vertex colors
    return new THREE.MeshStandardMaterial({
        color,
        roughness: materialConfig.roughness,
        metalness: materialConfig.metalness,
    });
  }, [geometryData, color, faceColor, renderConfig]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.copy(
      physicsBody.position as unknown as THREE.Vector3
    );
    meshRef.current.quaternion.copy(
      physicsBody.quaternion as unknown as THREE.Quaternion
    );
  });

  const mat = Array.isArray(material) ? material : material;

  return (
    <mesh
      ref={meshRef}
      geometry={geometryData.geometry}
      material={mat}
      castShadow
      receiveShadow
    />
  );
}