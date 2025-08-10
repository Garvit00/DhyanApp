import * as THREE from 'three';
import { Object3DNode } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface IntrinsicElements {
    // Geometry elements
    ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>
    directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
    group: Object3DNode<THREE.Group, typeof THREE.Group>
    points: Object3DNode<THREE.Points, typeof THREE.Points>
    bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>
    bufferAttribute: Object3DNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>
    pointsMaterial: Object3DNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>
    meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>
    spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>
    
    // Add all other Three.js components you're using
    perspectiveCamera: Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera>
    orbitControls: Object3DNode<any, any> // Special case for Drei components
  }
}