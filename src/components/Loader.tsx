import { Html } from "@react-three/drei";

const Loader = () => {
  return (
    <Html>
      <div className="absolute left-0 top-0 flex size-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white"></div>
      </div>
    </Html>
  );
};
export default Loader;
