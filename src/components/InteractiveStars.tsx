import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const InteractiveStars = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const group = useRef<THREE.Group>(null);
  const isDesktop = window.innerWidth >= 768;

  // Star texture generation
  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.5, "rgba(255,220,180,0.4)");
    gradient.addColorStop(1, "rgba(255,220,180,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Star positions, colors, sizes
  const { positions, colors, sizes } = useMemo(() => {
    const starCount = isDesktop ? 1500 : 2000;  // Fewer stars for desktop strip
    const spread = isDesktop ? 150 : 200;       // Smaller spread for desktop strip
    const baseColor = new THREE.Color("#aabfff");

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const r = Math.cbrt(Math.random()) * (spread / 2);
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions.set([x, y, z], i * 3);

      const color = baseColor.clone();
      color.lerp(new THREE.Color("#ffbca8"), Math.random() * 0.6);
      colors.set([color.r, color.g, color.b], i * 3);

      sizes[i] = Math.pow(Math.random(), 1) * 0.3 + 0.2;
    }

    return { positions, colors, sizes };
  }, [isDesktop]);

  // Animate group rotation based on mouse
  const rotation = useRef({ x: 0, y: 0 });
  useFrame(() => {
    if (group.current) {
      rotation.current.x += (mouse.y * 0.1 - rotation.current.x) * 0.05;
      rotation.current.y += (mouse.x * 0.1 - rotation.current.y) * 0.05;
      group.current.rotation.x = rotation.current.x;
      group.current.rotation.y = rotation.current.y;
    }
  });

  return (
    // @ts-expect-error: TypeScript doesn't recognize group
    <group ref={group} position={[0, 0, isDesktop ? -15 : -20]}>
      {/* @ts-expect-error: TypeScript doesn't recognize points */}
      <points>
        {/* @ts-expect-error: TypeScript doesn't recognize bufferGeometry */}
        <bufferGeometry>
          {/* @ts-expect-error: TypeScript doesn't recognize bufferAttribute */}
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
          {/* @ts-expect-error: TypeScript doesn't recognize bufferAttribute */}
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={colors.length / 3}
            itemSize={3}
          />
          {/* @ts-expect-error: TypeScript doesn't recognize bufferAttribute */}
          <bufferAttribute
            attach="attributes-size"
            array={sizes}
            count={sizes.length}
            itemSize={1}
          />
          {/* @ts-expect-error: TypeScript doesn't recognize bufferAttribute */}
        </bufferGeometry>
        {/* @ts-expect-error: TypeScript doesn't recognize pointsMaterial */}
        <pointsMaterial
          map={starTexture}
          size={0.5}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          blending={THREE.AdditiveBlending}
        />
        {/* @ts-expect-error: TypeScript doesn't recognize points */} 
      </points>
      {/* @ts-expect-error: TypeScript doesn't recognize group */}
    </group>
  );
};


export default InteractiveStars;