import type * as THREE from "three";

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  services: string[];
  videoSrc: string;
  projectUrl: string;
}

export interface DominoEntry {
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial[]>;
  materials: THREE.MeshPhysicalMaterial[];
  frontTexture: THREE.CanvasTexture;
  backTexture: THREE.CanvasTexture;
}
