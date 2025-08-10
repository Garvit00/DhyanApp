import { extend, ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'

// Extend React Three Fiber with all Three.js objects
extend(THREE)

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    // These should already be included but adding for completeness
    group: any
    mesh: any
    ambientLight: any
    directionalLight: any
    points: any
    bufferGeometry: any
    bufferAttribute: any
    pointsMaterial: any
    meshStandardMaterial: any
  }
} 