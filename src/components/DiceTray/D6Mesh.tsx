"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { createD6Textures } from "@/lib/faceTexture";

interface D6MeshProps {
  physicsBody: CANNON.Body;
  color?: string;
  faceColor?: string;
}

export default function D6Mesh({
  physicsBody,
  color = "#7C5CEF",
  faceColor = "#F0EEF8",
}: D6MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate face textures — one per face
  const materials = useMemo(() => {
    const textures = createD6Textures(color, faceColor);
    return textures.map(
      (texture) =>
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.4,
          metalness: 0.1,
        })
    );
  }, [color, faceColor]);

  // Sync mesh with physics body every frame
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.copy(
      physicsBody.position as unknown as THREE.Vector3
    );
    meshRef.current.quaternion.copy(
      physicsBody.quaternion as unknown as THREE.Quaternion
    );
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow material={materials}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}