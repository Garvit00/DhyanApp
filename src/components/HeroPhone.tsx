import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import ModelView from "./ModelView";
import gsap from "gsap";
import * as THREE from "three";
import { models } from '../constants';

interface HeroPhoneProps {
  screens?: string[];
  featuresMode?: boolean;
  onModelLoaded?: () => void;
}

const HeroPhone: React.FC<HeroPhoneProps> = ({ screens, featuresMode = false, onModelLoaded }) => {
    const [screenIndex, setScreenIndex] = useState(0);
    const [allTexturesLoaded, setAllTexturesLoaded] = useState(false);
    const [modelInitialized, setModelInitialized] = useState(false);
    // FIX: Use the non-null assertion (!) to satisfy the eventSource prop type.
    const canvasContainerRef = useRef<HTMLDivElement>(null!);
    const controlsRef = useRef<any>(null);
    const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const modelRef = useRef<any>(null);
    const texturesRef = useRef<THREE.Texture[]>([]);
    
    // Filter out any falsy or undefined image URLs
    const screenImages = (screens || []).filter(Boolean);

    // Initialize model state immediately to prevent delays
    useEffect(() => {
        // Set model as initialized quickly to reduce loading time
        const initTimer = setTimeout(() => {
            setModelInitialized(true);
        }, 100);
        return () => clearTimeout(initTimer);
    }, []);

    // Preload all textures
    useEffect(() => {
        if (screenImages.length === 0) {
            setAllTexturesLoaded(true);
            // Notify parent that model is ready even with no screens
            if (onModelLoaded) {
                setTimeout(() => onModelLoaded(), 100);
            }
            return;
        }
        
        const preloadTextures = async () => {
            const texturePromises = screenImages.map((src, index) => {
                return new Promise<THREE.Texture>((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => {
                        const texture = new THREE.Texture(img);
                        texture.generateMipmaps = true;
                        texture.minFilter = THREE.LinearMipmapLinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.wrapS = THREE.ClampToEdgeWrapping;
                        texture.wrapT = THREE.ClampToEdgeWrapping;
                        texture.needsUpdate = true;
                        texturesRef.current[index] = texture;
                        resolve(texture);
                    };
                    img.onerror = reject;
                    img.src = src;
                });
            });
            
            try {
                await Promise.all(texturePromises);
                setAllTexturesLoaded(true);
                // Notify parent that model is ready
                if (onModelLoaded) {
                    setTimeout(() => onModelLoaded(), 150);
                }
            } catch (error) {
                console.error("Error preloading textures:", error);
                setAllTexturesLoaded(true); // Show anyway
                // Still notify parent even if textures failed to load
                if (onModelLoaded) {
                    setTimeout(() => onModelLoaded(), 150);
                }
            }
        };
        
        preloadTextures();
    }, [screenImages, onModelLoaded]);

    // Remove auto-switching timer if featuresMode is true
    useEffect(() => {
        if (featuresMode) return;
        if (!allTexturesLoaded || screenImages.length === 0) return;
        
        const interval = setInterval(() => {
            setScreenIndex((prev) => (prev + 1) % screenImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [allTexturesLoaded, screenImages.length, featuresMode]);

    // Add floating animation for the iPhone
    useEffect(() => {
        if (!allTexturesLoaded || !modelRef.current || !modelInitialized) return;
        
        // Create a subtle floating animation with position only (no scale change)
        const floatingAnimation = gsap.timeline({ repeat: -1, yoyo: true })
            .to(modelRef.current.position, {
                y: 0.04, // 4px equivalent in 3D space
                duration: 2,
                ease: "power2.inOut",
            });
        // Removed scale animation to prevent size changes
        
        return () => {
            floatingAnimation.kill();
        };
    }, [allTexturesLoaded, modelInitialized]);

    // Reset to original position after interaction ends
    const resetToOriginalPosition = () => {
        if (controlsRef.current) {
            gsap.to(controlsRef.current.object.position, {
                x: 0,
                y: 0,
                z: 5,
                duration: 1.5,
                ease: "power2.out"
            });
            gsap.to(controlsRef.current.target, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: "power2.out"
            });
        }
        if (modelRef.current) {
            gsap.to(modelRef.current.rotation, {
                y: -0.2,
                duration: 1.5,
                ease: "power2.out"
            });
        }
    };

    const handleInteractionStart = () => {
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }
    };

    const handleInteractionEnd = () => {
        // Reset after 2 seconds of no interaction
        resetTimeoutRef.current = setTimeout(() => {
            resetToOriginalPosition();
        }, 2000);
    };

    // Interactive switching for featuresMode
    const lastRotation = useRef(0);
    const handleDrag = (event: any) => {
        if (!featuresMode) {
            if (controlsRef.current && modelRef.current) {
                const deltaX = event.deltaX;
                const rotationSpeed = 0.02;
                if (deltaX > 0) {
                    modelRef.current.rotation.y -= deltaX * rotationSpeed;
                }
            }
            return;
        }
        // For featuresMode: switch image based on rotation
        if (controlsRef.current && modelRef.current) {
            const rotationY = modelRef.current.rotation.y;
            const diff = rotationY - lastRotation.current;
            lastRotation.current = rotationY;
            // Threshold for left/right
            if (diff < -0.01) {
                setScreenIndex(0); // left image
            } else if (diff > 0.01) {
                setScreenIndex(2); // right image
            } else {
                setScreenIndex(1); // center image
            }
        }
    };

    useEffect(() => {
        return () => {
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
            }
        };
    }, []);

    const modelData = {
        id: models[0].id,
        title: models[0].title,
        color: models[0].color[0], // Gold titanium color
        preloadedTextures: texturesRef.current,
        currentTextureIndex: screenIndex,
    };

    if (screenImages.length === 0 && !modelInitialized) {
        return (
            <div className="relative h-[75vh] w-full overflow-hidden md:h-[90vh] flex items-center justify-center bg-transparent">
                <div className="text-white opacity-50">Initializing...</div>
            </div>
        );
    }

    const isTouchDevice = 
        typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

        useEffect(() => {
            if(isTouchDevice && modelRef.current){
                // Start from a slight angle to look natural
                modelRef.current.rotation.y = -1;
                // Simple infinite Y rotation
                const rotationAnim = gsap.to(modelRef.current.rotation, {
                y: 0.9, // rotate to +0.2 radians (~11 degrees)
                duration: 4, // speed in seconds
                yoyo: true,  // reverse back
                repeat: -1,
                ease: "power1.inOut"
                });
            return () => { rotationAnim.kill() };
            }
        },[isTouchDevice, allTexturesLoaded]);


    return (
        <div ref={canvasContainerRef} className="relative h-[72vh] w-full overflow-hidden md:h-[90vh]"
        style={{touchAction: 'pan-y'} }
        >
            <Canvas
                className="size-full"
                style={{ position: "absolute", top: 0, left: 0, touchAction: 'pan-y'}}
                eventSource={canvasContainerRef}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={30}
                />

                <OrbitControls
                    ref={controlsRef}
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={!isTouchDevice}
                    rotateSpeed={0.4}
                    target={[0, 0, 0]}
                    minPolarAngle={featuresMode ? Math.PI / 2 : Math.PI / 2 - 0.3}
                    maxPolarAngle={featuresMode ? Math.PI / 2 : Math.PI / 2 + 0.3}
                    minAzimuthAngle={-0.7}
                    maxAzimuthAngle={0.7}
                    enableDamping={true}
                    dampingFactor={0.05}
                    onStart={handleInteractionStart}
                    onEnd={handleInteractionEnd}
                    onChange={handleDrag}
                    touches={{
                        ONE: 0,  // disable single finger touch rotation
                        TWO: 0   // disable pinch/pan
                    }}
                />

                {/* @ts-expect-error: TypeScript doesn't recognize ambientLight */}
                <ambientLight intensity={1} />
                {/* @ts-expect-error: TypeScript doesn't recognize directionalLight */}
                <directionalLight position={[5, 5, 5]} intensity={1} />

                <ModelView
                    ref={modelRef}
                    item={modelData}
                    size="small"
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                />
            </Canvas>
        </div>
    );
};

export default HeroPhone;