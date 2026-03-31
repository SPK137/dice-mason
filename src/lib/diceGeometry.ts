import * as THREE from "three";
import * as CANNON from "cannon-es";

export interface DieGeometryData {
  geometry: THREE.BufferGeometry;
  physicsVertices: CANNON.Vec3[];
  physicsFaces: number[][];
  faceNormals: THREE.Vector3[];  // one per face, in local space
  faceValues: (number | string)[]; // result value per face
}

// ─── D4 ───────────────────────────────────────────────────────────────────────

export function createD4Geometry(): DieGeometryData {
  const geometry = new THREE.TetrahedronGeometry(1, 0);

  const r = 1;
  const vertices: CANNON.Vec3[] = [
    new CANNON.Vec3(1, 1, 1),
    new CANNON.Vec3(-1, -1, 1),
    new CANNON.Vec3(-1, 1, -1),
    new CANNON.Vec3(1, -1, -1),
  ].map((v) => new CANNON.Vec3(v.x * r, v.y * r, v.z * r));

  const faces = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
    [1, 3, 2],
  ];

  // D4 reads the bottom face (lowest vertex sum)
  const faceNormals = [
    new THREE.Vector3(0, -1, 1).normalize(),
    new THREE.Vector3(1, -1, 0).normalize(),
    new THREE.Vector3(0, 1, 1).normalize(),
    new THREE.Vector3(-1, 0, 1).normalize(),
  ];

  return {
    geometry,
    physicsVertices: vertices,
    physicsFaces: faces,
    faceNormals,
    faceValues: [1, 2, 3, 4],
  };
}

// ─── D6 ───────────────────────────────────────────────────────────────────────

export function createD6Geometry(): DieGeometryData {
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const s = 0.5;
  const vertices = [
    new CANNON.Vec3(-s, -s, -s),
    new CANNON.Vec3(s, -s, -s),
    new CANNON.Vec3(s, s, -s),
    new CANNON.Vec3(-s, s, -s),
    new CANNON.Vec3(-s, -s, s),
    new CANNON.Vec3(s, -s, s),
    new CANNON.Vec3(s, s, s),
    new CANNON.Vec3(-s, s, s),
  ];

  const faces = [
    [3, 2, 1, 0],
    [4, 5, 6, 7],
    [0, 1, 5, 4],
    [1, 2, 6, 5],
    [2, 3, 7, 6],
    [3, 0, 4, 7],
  ];

  const faceNormals = [
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(-1, 0, 0),
  ];

  return {
    geometry,
    physicsVertices: vertices,
    physicsFaces: faces,
    faceNormals,
    faceValues: [1, 6, 2, 5, 3, 4],
  };
}

// ─── D8 ───────────────────────────────────────────────────────────────────────

export function createD8Geometry(): DieGeometryData {
  const geometry = new THREE.OctahedronGeometry(1, 0);

  const r = 1;
  const vertices: CANNON.Vec3[] = [
    new CANNON.Vec3(r, 0, 0),
    new CANNON.Vec3(-r, 0, 0),
    new CANNON.Vec3(0, r, 0),
    new CANNON.Vec3(0, -r, 0),
    new CANNON.Vec3(0, 0, r),
    new CANNON.Vec3(0, 0, -r),
  ];

  const faces = [
    [0, 2, 4],
    [0, 4, 3],
    [0, 3, 5],
    [0, 5, 2],
    [1, 4, 2],
    [1, 3, 4],
    [1, 5, 3],
    [1, 2, 5],
  ];

  const faceNormals = faces.map((face) => {
    const a = new THREE.Vector3(vertices[face[0]].x, vertices[face[0]].y, vertices[face[0]].z);
    const b = new THREE.Vector3(vertices[face[1]].x, vertices[face[1]].y, vertices[face[1]].z);
    const c = new THREE.Vector3(vertices[face[2]].x, vertices[face[2]].y, vertices[face[2]].z);
    return new THREE.Vector3()
      .crossVectors(b.clone().sub(a), c.clone().sub(a))
      .normalize();
  });

  return {
    geometry,
    physicsVertices: vertices,
    physicsFaces: faces,
    faceNormals,
    faceValues: [1, 2, 3, 4, 5, 6, 7, 8],
  };
}

// ─── D10 ──────────────────────────────────────────────────────────────────────

function buildD10Data(faceValues: (number | string)[]): DieGeometryData {
  const sides = 10;
  const vertices: CANNON.Vec3[] = [];
  const faces: number[][] = [];

  // Two rings of 10 vertices + top and bottom apex
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const offset = i % 2 === 0 ? 0.1 : -0.1;
    vertices.push(new CANNON.Vec3(
      Math.cos(angle) * 0.9,
      offset,
      Math.sin(angle) * 0.9
    ));
  }
  vertices.push(new CANNON.Vec3(0, 1, 0));   // top apex — index 10
  vertices.push(new CANNON.Vec3(0, -1, 0));  // bottom apex — index 11

  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides;
    faces.push([i, next, 10]);          // top faces
    faces.push([next, i, 11]);          // bottom faces
  }

  const faceNormals = faces.map((face) => {
    const a = new THREE.Vector3(vertices[face[0]].x, vertices[face[0]].y, vertices[face[0]].z);
    const b = new THREE.Vector3(vertices[face[1]].x, vertices[face[1]].y, vertices[face[1]].z);
    const c = new THREE.Vector3(vertices[face[2]].x, vertices[face[2]].y, vertices[face[2]].z);
    return new THREE.Vector3()
      .crossVectors(b.clone().sub(a), c.clone().sub(a))
      .normalize();
  });

  // Build geometry from vertices and faces
  const positions: number[] = [];
  faces.forEach((face) => {
    face.forEach((vi) => {
      positions.push(vertices[vi].x, vertices[vi].y, vertices[vi].z);
    });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();

  return {
    geometry,
    physicsVertices: vertices,
    physicsFaces: faces,
    faceNormals,
    faceValues,
  };
}

export function createD10Geometry(): DieGeometryData {
  return buildD10Data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
}

export function createD100Geometry(): DieGeometryData {
  return buildD10Data([0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
}

// ─── D12 ──────────────────────────────────────────────────────────────────────

export function createD12Geometry(): DieGeometryData {
  const geometry = new THREE.DodecahedronGeometry(1, 0);
  const posAttr = geometry.getAttribute("position");

  // Extract unique vertices
  const vertexMap = new Map<string, number>();
  const vertices: CANNON.Vec3[] = [];

  const round = (v: number) => Math.round(v * 1000) / 1000;

  for (let i = 0; i < posAttr.count; i++) {
    const x = round(posAttr.getX(i));
    const y = round(posAttr.getY(i));
    const z = round(posAttr.getZ(i));
    const key = `${x},${y},${z}`;
    if (!vertexMap.has(key)) {
      vertexMap.set(key, vertices.length);
      vertices.push(new CANNON.Vec3(x, y, z));
    }
  }

  // Build faces from index groups of 3
  const indexAttr = geometry.getIndex();
  const faceSet = new Map<string, number[]>();

  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i += 3) {
      const a = indexAttr.getX(i);
      const b = indexAttr.getX(i + 1);
      const c = indexAttr.getX(i + 2);

      const ax = round(posAttr.getX(a)), ay = round(posAttr.getY(a)), az = round(posAttr.getZ(a));
      const bx = round(posAttr.getX(b)), by = round(posAttr.getY(b)), bz = round(posAttr.getZ(b));
      const cx = round(posAttr.getX(c)), cy = round(posAttr.getY(c)), cz = round(posAttr.getZ(c));

      const ia = vertexMap.get(`${ax},${ay},${az}`)!;
      const ib = vertexMap.get(`${bx},${by},${bz}`)!;
      const ic = vertexMap.get(`${cx},${cy},${cz}`)!;

      // Group triangles by normal direction to reconstruct pentagon faces
      const normal = new THREE.Vector3(ax + bx + cx, ay + by + cy, az + bz + cz).normalize();
      const key = `${Math.round(normal.x * 10)},${Math.round(normal.y * 10)},${Math.round(normal.z * 10)}`;

      if (!faceSet.has(key)) faceSet.set(key, []);
      faceSet.get(key)!.push(ia, ib, ic);
    }
  }

  const faces = Array.from(faceSet.values()).map((f) => [...new Set(f)]);
  const faceNormals = faces.map((face) => {
    const a = new THREE.Vector3(vertices[face[0]].x, vertices[face[0]].y, vertices[face[0]].z);
    const b = new THREE.Vector3(vertices[face[1]].x, vertices[face[1]].y, vertices[face[1]].z);
    const c = new THREE.Vector3(vertices[face[2]].x, vertices[face[2]].y, vertices[face[2]].z);
    return a.clone().add(b).add(c).normalize();
  });

  return {
    geometry,
    physicsVertices: vertices,
    physicsFaces: faces,
    faceNormals,
    faceValues: Array.from({ length: 12 }, (_, i) => i + 1),
  };
}

// ─── D20 ──────────────────────────────────────────────────────────────────────

export function createD20Geometry(): DieGeometryData {
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const posAttr = geometry.getAttribute("position");

  const round = (v: number) => Math.round(v * 1000) / 1000;

  const vertexMap = new Map<string, number>();
  const vertices: CANNON.Vec3[] = [];

  for (let i = 0; i < posAttr.count; i++) {
    const x = round(posAttr.getX(i));
    const y = round(posAttr.getY(i));
    const z = round(posAttr.getZ(i));
    const key = `${x},${y},${z}`;
    if (!vertexMap.has(key)) {
      vertexMap.set(key, vertices.length);
      vertices.push(new CANNON.Vec3(x, y, z));
    }
  }

  const indexAttr = geometry.getIndex();
  const faces: number[][] = [];
  const faceNormals: THREE.Vector3[] = [];

  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i += 3) {
      const a = indexAttr.getX(i);
      const b = indexAttr.getX(i + 1);
      const c = indexAttr.getX(i + 2);

      const ax = round(posAttr.getX(a)), ay = round(posAttr.getY(a)), az = round(posAttr.getZ(a));
      const bx = round(posAttr.getX(b)), by = round(posAttr.getY(b)), bz = round(posAttr.getZ(b));
      const cx = round(posAttr.getX(c)), cy = round(posAttr.getY(c)), cz = round(posAttr.getZ(c));

      const ia = vertexMap.get(`${ax},${ay},${az}`)!;
      const ib = vertexMap.get(`${bx},${by},${bz}`)!;
      const ic = vertexMap.get(`${cx},${cy},${cz}`)!;

      faces.push([ia, ib, ic]);

      const va = new THREE.Vector3(ax, ay, az);
      const vb = new THREE.Vector3(bx, by, bz);
      const vc = new THREE.Vector3(cx, cy, cz);
      faceNormals.push(va.clone().add(vb).add(vc).normalize());
    }
  }

  return {
    geometry,
    physicsVertices: vertices,
    physicsFaces: faces,
    faceNormals,
    faceValues: Array.from({ length: 20 }, (_, i) => i + 1),
  };
}