"use client";

import { useThree } from "@react-three/fiber";
import { useDynamicWalls } from "@/hooks/useDynamicWalls";
import { RefObject } from "react";
import * as CANNON from "cannon-es";

interface DynamicWallsProps {
  worldRef: RefObject<CANNON.World | null>;
}

export default function DynamicWalls({ worldRef }: DynamicWallsProps) {
  const { camera } = useThree();
  useDynamicWalls(worldRef, camera);
  return null;
}