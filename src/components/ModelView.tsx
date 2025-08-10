// src/components/ModelView.tsx

import { Suspense, forwardRef } from "react";
import IphoneModel from "./IphoneModel";
import Loader from "./Loader";

type ModelViewProps = {
  item: any;
  size: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

const ModelView = forwardRef<any, ModelViewProps>(({ item, size, position, rotation }, ref) => {
  const getScale = (): [number, number, number] => {
    switch (size) {
      case "medium":
        return [16, 16, 16];
      case "large":
        return [17, 17, 17];
      default:
        return [14, 14, 14];
    }
  };

  // Prevent rendering if no valid image or textures
  const hasValidTexture =
    (item.preloadedTextures && item.preloadedTextures.length > 0) ||
    (typeof item.img === 'string' && item.img.trim().length > 0);
  if (!hasValidTexture) return null;

  return (
    // @ts-expect-error: TypeScript doesn't recognize group
    <group ref={ref} position={position} rotation={rotation}>
      <Suspense fallback={<Loader />}>
        <IphoneModel
          scale={getScale()}
          item={item}
          size={size}
        />
      </Suspense>
      {/* @ts-expect-error: TypeScript doesn't recognize group */}
    </group>
  );
});

export default ModelView;