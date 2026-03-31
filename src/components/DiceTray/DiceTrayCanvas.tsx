import * as THREE from "three";
import { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as CANNON from "cannon-es";
import D6Mesh from "./D6Mesh";
import PhysicsRunner from "./PhysicsRunner";
import DynamicWalls from "./DynamicWalls";
import { RenderConfig } from "@/lib/renderConfig";

interface DiceTrayCanvasProps {
    renderConfig: RenderConfig;
    worldRef: RefObject<CANNON.World | null>;
    dieBodies: CANNON.Body[]
}

export default function DiceTrayCanvas({
    renderConfig,
    worldRef,
    dieBodies
}: DiceTrayCanvasProps) {
    return <>
        <Canvas
                shadows={{ type: THREE.PCFShadowMap }}
                camera={{ position: [0, 8, 0], fov: 45, rotation: [0, Math.PI, 0] }}
                style={{ background: "#0F0F14" }}
              >
                <ambientLight intensity={0.4} />
                <directionalLight
                  position={[5, 10, 5]}
                  intensity={1.2}
                  castShadow
                  shadow-mapSize={[renderConfig.shadowMapSize, renderConfig.shadowMapSize]}
                />
                <pointLight position={[-5, 5, -5]} intensity={0.4} color="#9B7EFF" />
        
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                  <planeGeometry args={[20, 20]} />
                  <meshStandardMaterial color="#1A1A24" roughness={0.9} />
                </mesh>
        
                <Grid
                  position={[0, 0.01, 0]}
                  args={[20, 20]}
                  cellColor="#2E2E42"
                  sectionColor="#2E2E42"
                  fadeDistance={12}
                />
        
                {worldRef.current && <PhysicsRunner worldRef={worldRef} physicsFps={renderConfig.physicsFps}/>}
                {worldRef.current && <DynamicWalls worldRef={worldRef} />}
        
                {dieBodies.map((body, i) => (
                  <D6Mesh key={i} physicsBody={body} scale={renderConfig.diceScale} renderConfig={renderConfig}/>
                ))}
        
                <OrbitControls
                  enabled={false}
                  enablePan={false}
                  minDistance={4}
                  maxDistance={14}
                  maxPolarAngle={Math.PI / 2.2}
                  minAzimuthAngle={-Math.PI / 2.2}
                  maxAzimuthAngle={Math.PI / 2.2}
                />
              </Canvas>
    </>
}