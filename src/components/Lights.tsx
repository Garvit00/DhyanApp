import { Environment, Lightformer } from "@react-three/drei";

const Lights = () => {
  return (
    // @ts-expect-error: TypeScript doesn't recognize group
    <group name="lights">
      <Environment resolution={256}>
        {/* @ts-expect-error: TypeScript doesn't recognize group */}
        <group>
          <Lightformer form="rect" intensity={10} position={[-1, 0, -10]} scale={10} color={"#495057"} />
          <Lightformer form="rect" intensity={10} position={[-10, 2, 1]} scale={10} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={10} position={[10, 0, 1]} scale={10} rotation-y={Math.PI / 2} />
          {/* @ts-expect-error: TypeScript doesn't recognize spotLight */}
        </group>
      </Environment>
      {/* @ts-expect-error: TypeScript doesn't recognize spotLight */}
      <spotLight
        position={[-2, 10, 5]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI * 0.2}
        color={"#f8f9fa"}
      />
      {/* @ts-expect-error: TypeScript doesn't recognize spotLight */}
      <spotLight
        position={[0, -25, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI * 0.2}
        color={"#f8f9fa"}
      />
      {/* @ts-expect-error: TypeScript doesn't recognize spotLight */}
      <spotLight position={[0, 15, 5]} angle={0.15} penumbra={1} decay={0.1} intensity={Math.PI * 3} />
      {/* @ts-expect-error: TypeScript doesn't recognize group */}
    </group>
  );
};

export default Lights;
