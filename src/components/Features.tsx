import { useEffect, useRef, useState, forwardRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import ModelView from "./ModelView"; 
import * as THREE from 'three';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import '../index.css';
import { useMediaQuery } from 'react-responsive';
import HeroPhone from "./HeroPhone";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface FeatureData {
  title: string;
  content: string;
  image1: string;
  image2: string;
  image3: string;
}

interface Category {
  name: string;
  description: string;
  images: string[];
  preloadedTextures?: THREE.Texture[]; // For desktop seamless experience
}

const FEATURE_ORDER = [
  "Meditation",
  "Mantra",
  "Pranayama",
  "Knowledge",
  "Yoga"
];

const Features = forwardRef<HTMLDivElement>((_, ref) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showFixedBg, setShowFixedBg] = useState(false);
    const globeGroupRef = useRef<THREE.Group>(null!);
    const modelGroupRefs = useRef<{[key: string]: THREE.Group | null}>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Intersection Observer for fixed bg
    useEffect(() => {
        const section = containerRef.current;
        if (!section) return;
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                setShowFixedBg(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    // Hide Navbar when Features is in view (all devices)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const trigger = ScrollTrigger.create({
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            onEnter: () => window.dispatchEvent(new Event('hideNavbar')),
            onEnterBack: () => window.dispatchEvent(new Event('hideNavbar')),
            onLeave: () => window.dispatchEvent(new Event('showNavbar')),
            onLeaveBack: () => window.dispatchEvent(new Event('showNavbar')),
        });
        return () => trigger.kill();
    }, []);

    // Fetch features data from Firebase
    useEffect(() => {
        const fetchFeaturesData = async () => {
            try {
                console.log("Fetching features data from Firebase...");
                const featuresRef = collection(
                    firestore,
                    "Website_New",
                    "86TJ2c4q1WqM1sqYXgKJ",
                    "Features"
                );
                
                const querySnapshot = await getDocs(featuresRef);
                const featuresData: { [key: string]: FeatureData } = {};
                
                querySnapshot.forEach((doc) => {
                    console.log("Feature document:", doc.id, doc.data());
                    featuresData[doc.id] = doc.data() as FeatureData;
                });

                console.log("Raw features data:", featuresData);

                // Convert Firebase data to categories format
                let categoriesArray: Category[] = Object.entries(featuresData).map(([key, data]) => {
                    const images = [data.image1, data.image2, data.image3].filter(Boolean);
                    return {
                        name: data.title || key,
                        description: data.content || "",
                        images: images
                    };
                });

                // Preload all images for all categories as HTML images (for mobile/HeroPhone)
                const allImages = categoriesArray.flatMap(cat => cat.images).filter(Boolean);
                const preloadPromises = allImages.map(src => {
                    return new Promise((resolve, reject) => {
                        const img = new window.Image();
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = src;
                    });
                });
                try {
                    await Promise.all(preloadPromises);
                } catch (e) {
                    // Ignore errors, just continue
                }

                // Preload Three.js textures for desktop
                let allTexturePromises: Promise<THREE.Texture[]>[] = [];
                if (!isMobile) {
                    for (const cat of categoriesArray) {
                        const texturePromises = cat.images.map(src => {
                            return new Promise<THREE.Texture>((resolve, reject) => {
                                const img = new window.Image();
                                img.crossOrigin = "anonymous";
                                img.onload = () => {
                                    const texture = new THREE.Texture(img);
                                    texture.generateMipmaps = true;
                                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                                    texture.magFilter = THREE.LinearFilter;
                                    texture.wrapS = THREE.ClampToEdgeWrapping;
                                    texture.wrapT = THREE.ClampToEdgeWrapping;
                                    texture.needsUpdate = true;
                                    resolve(texture);
                                };
                                img.onerror = reject;
                                img.src = src;
                            });
                        });
                        allTexturePromises.push(Promise.all(texturePromises).then(textures => {
                            cat.preloadedTextures = textures;
                            return textures;
                        }));
                    }
                }
                if (!isMobile) {
                    try {
                        await Promise.all(allTexturePromises);
                    } catch (e) {
                        // Ignore errors, just continue
                    }
                }

                // Sort by FEATURE_ORDER
                categoriesArray = categoriesArray.sort((a, b) => {
                  return FEATURE_ORDER.indexOf(a.name) - FEATURE_ORDER.indexOf(b.name);
                });

                setCategories(categoriesArray);
            } catch (error) {
                console.error("Error fetching features data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturesData();
        // Force refresh after data is loaded
        setTimeout(() => ScrollTrigger.refresh(), 300);
    }, []);

    // Pinning and Scrubbing Logic (Internal Features Scroll)
    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content || categories.length === 0) return;

        // Set the container height to create scroll space for all models
        const totalScrollHeight = categories.length * 100; // 100vh per model
        gsap.set(container, { height: `${totalScrollHeight}vh` });

        // Create the main ScrollTrigger for pinning and scrubbing
        const scrollTrigger = ScrollTrigger.create({
            trigger: container,
            start: "top top", // Starts when snapped to the top
            end: `+=${(categories.length - 1) * 100}%`,
            pin: content,
            pinSpacing: false,
            scrub: 1,
            onUpdate: (self) => {
                const newIndex = Math.min(
                    Math.floor(self.progress * categories.length),
                    categories.length - 1
                );
                
                if (newIndex !== currentCategoryIndex && !isAnimating) {
                    switchCategory(newIndex);
                }
            }
        });

        // Refresh ScrollTrigger after setup to ensure calculations are correct
        setTimeout(() => ScrollTrigger.refresh(), 100);

        return () => {
            scrollTrigger.kill();
        };
    }, [categories.length, currentCategoryIndex, isAnimating]);

    // Category Switching Animation Logic
    const switchCategory = (newCategoryIndex: number) => {
        if (newCategoryIndex === currentCategoryIndex || isAnimating || categories.length === 0) return;
        setIsAnimating(true);
        
        // Create a timeline for smoother animation sequencing
        const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false)
        });
        
        // Animate text transition
        tl.to(".features-text-content", {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in",
        })
        .call(() => {
            setCurrentCategoryIndex(newCategoryIndex);
        })
        .fromTo(".features-text-content", 
            { opacity: 0, y: 20 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                ease: "power2.out",
            }
        );

        // Rotate the globe (if using rotation for switching)
        if (globeGroupRef.current) {
            const angleStep = (2 * Math.PI) / categories.length;
            const targetRotationY = -newCategoryIndex * angleStep;
            
            gsap.to(globeGroupRef.current.rotation, {
                y: targetRotationY,
                duration: 1.2,
                ease: "power4.inOut"
            });
        }
    };

    if (loading || categories.length === 0 || (!isMobile && categories.some(cat => !cat.preloadedTextures))) {
        return (
            <div id="features" className="min-h-screen flex items-center justify-center">
                <div className="text-black text-xl">
                    {loading ? "Loading features..." : "No features found"}
                </div>
            </div>
        );
    }

    console.log("Current category:", categories[currentCategoryIndex]);

    return (
        <div id="features" ref={(element) => {
            containerRef.current = element;
            if (ref) {
                if (typeof ref === 'function') {
                    ref(element);
                } else {
                    ref.current = element;
                }
            }
        }} className="relative" style={{ zIndex: 1 }}> 
            {/* Fixed background overlay */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -1,
                    backgroundImage: "url('/images/bg_desktop.webp')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top center',
                    backgroundSize: 'cover',
                    pointerEvents: 'none',
                    transition: 'opacity 0.4s',
                    opacity: showFixedBg ? 1 : 0
                }}
                aria-hidden="true"
            />
            
            <section 
                ref={contentRef}
                className="min-h-screen flex flex-col overflow-hidden relative z-10"
            >
                <div className="screen-max-width w-full flex-1 flex flex-col">
                    
                    {/* Text Content Wrapper for animation */}
                    <div className="features-text-content w-full flex-shrink-0">

                        {/* Desktop Layout */}
                        <div className="mt-[20px] mb-6 text-center category-info hidden md:block px-2">
                            <h3
                                className="features-title mb-4 text-5xl lg:text-7xl xl:text-8xl font-normal"
                                style={{
                                    fontFamily: "Gelica, sans-serif",
                                    textAlign: "center",
                                    color: "#1a1a1a",
                                    lineHeight: "1.1",
                                    letterSpacing: "-0.02em",
                                    fontWeight: "600",
                                    marginTop: '0px'
                                }}
                            >
                                {categories[currentCategoryIndex]?.name || "Loading..."}
                            </h3>
                            <p
                                className="features-description"
                                style={{
                                    fontFamily: "SF Pro Display, sans-serif",
                                    fontSize: "18px",
                                    color: "#222",
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    textAlign: "center",
                                    maxWidth: "1200px",
                                    margin: "0 auto 0 auto",
                                    paddingTop: '0px'
                                }}
                            >
                                {categories[currentCategoryIndex]?.description || "Loading description..."}
                            </p>
                        </div>

                        {/* Mobile Layout - Fixed positioning and responsive */}
                        <div className="text-left category-info block md:hidden px-4 pt-6 flex-shrink-0">
                            <div className="fixed-header">
                                <h3
                                    className="mb-3 text-2xl xs:text-3xl sm:text-4xl font-semibold text-left"
                                    style={{
                                        fontFamily: "Gelica, sans-serif",
                                        color: "#1a1a1a",
                                        lineHeight: "1.1",
                                        letterSpacing: "-0.01em",
                                        fontWeight: 700,
                                        fontSize: "clamp(1.8rem, 4vw, 2.2rem)"
                                    }}
                                >
                                    {categories[currentCategoryIndex]?.name || "Loading..."}
                                </h3>
                                <div className="expandable-content">
                                    <p
                                        className={`text-sm xs:text-base sm:text-lg leading-relaxed transition-all duration-300 ease-in-out ${showFullDescription ? 'max-h-none' : 'max-h-[4.5rem] overflow-hidden'}`}
                                        style={{
                                            fontFamily: "SF Pro Display, sans-serif",
                                            color: "#555555",
                                            fontWeight: 400,
                                            maxWidth: "90vw",
                                            fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
                                            lineHeight: 1.5,
                                            marginBottom: categories[currentCategoryIndex]?.description && categories[currentCategoryIndex].description.length > 80 ? '0.5rem' : '1rem'
                                        }}
                                    >
                                        {categories[currentCategoryIndex]?.description || "Loading description..."}
                                    </p>
                                    {categories[currentCategoryIndex]?.description && categories[currentCategoryIndex].description.length > 80 && (
                                      <button
                                        className="text-blue-600 text-xs sm:text-sm focus:outline-none transition-colors duration-200 hover:text-blue-700"
                                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                        onClick={() => setShowFullDescription(v => !v)}
                                      >
                                        {showFullDescription ? 'Show less' : 'Read more'}
                                      </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Responsive spacing */}
                    <div className="hidden md:block" style={{ paddingTop: '32px' }} />

                    {/* Canvas or HeroPhone for models */}
                    {isMobile ? (
                      <div className="w-full flex justify-center items-end flex-1 min-h-0 pb-6 overflow-y-auto" style={{ paddingBottom: '24px', maxHeight: '75vh' }}>
                        <div 
                            className="transition-all duration-300 ease-in-out"
                            style={{
                                transform: `scale(${showFullDescription ? '0.9' : '1'})`,
                                transformOrigin: 'center bottom',
                                width: '100%',
                                maxWidth: showFullDescription ? '320px' : '300px',
                                margin: '0 auto'
                            }}
                        >
                            <HeroPhone screens={categories[currentCategoryIndex]?.images} featuresMode={true} />
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-[30vh] w-full md:h-[70vh] group -mt-16">
                        {/* Scrollable side overlays */}
                        <div
                          className="absolute left-0 top-0 h-full z-20"
                          style={{ width: '15%', pointerEvents: 'auto', background: 'transparent' }}
                        />
                        <div
                          className="absolute right-0 top-0 h-full z-20"
                          style={{ width: '15%', pointerEvents: 'auto', background: 'transparent' }}
                        />
                        <Canvas
                            className="size-full"
                            gl={{
                                antialias: true,
                                alpha: true,
                                powerPreference: "high-performance",
                            }}
                            dpr={[1, 2]}
                        >
                            {/* @ts-expect-error */}
                            <ambientLight intensity={1}/>
                            {/* @ts-expect-error */}
                            <directionalLight position={[3, 5, 4]} intensity={2} />
                            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={30} />
                            <OrbitControls
                                enableZoom={false}
                                enablePan={false}
                                enableRotate={false}
                            />
                            {/* @ts-expect-error */}
                            <group ref={globeGroupRef}>
                                {categories.map((category, catIndex) => {
                                    // Optimization: Only render the current category's models
                                    if (catIndex !== currentCategoryIndex) return null;

                                    const categoryAngle = (catIndex / categories.length) * Math.PI * 2;
                                    const globeRadius = 3.5;
                                    const clusterAngle = 0.4;

                                    // Desktop/tablet: show all models as before
                                    return category.images.map((img, modelIndex) => {
                                        if (!img) return null; // Skip if no image

                                        const modelAngleOffset = (modelIndex - 1) * clusterAngle;
                                        const finalAngle = categoryAngle + modelAngleOffset;

                                        const position: [number, number, number] = [
                                            globeRadius * Math.sin(finalAngle),
                                            0,
                                            globeRadius * Math.cos(finalAngle),
                                        ];
                                       
                                        const baseRotation: [number, number, number] = [0, finalAngle, 0];
                                        const key = `cat-${catIndex}-model-${modelIndex}`;
                                        const modelData = {
                                            id: key,
                                            title: `${category.name} ${modelIndex + 1}`,
                                            img: img,
                                            preloadedTextures: category.preloadedTextures || [],
                                            currentTextureIndex: modelIndex,
                                        };

                                        return (
                                            // @ts-expect-error
                                            <group
                                                key={key}
                                                ref={(el: THREE.Group | null) => {
                                                    if (el) modelGroupRefs.current[key] = el;
                                                }}
                                                position={position}
                                                rotation={baseRotation}
                                                scale={1}
                                            >
                                                <ModelView
                                                    item={modelData}
                                                    size="small"
                                                    position={[0,0,0]}
                                                    rotation={[0,0,0]}
                                                />
                                            {/* @ts-expect-error */}
                                            </group>
                                        );
                                    });
                                })}
                            {/* @ts-expect-error */}
                            </group>
                        </Canvas>
                      </div>
                    )}
                    
                    {/* Add padding below models for desktop only */}
                    <div className="hidden md:block" style={{ paddingBottom: '20px' }} />
                </div>
            </section>
        </div>
    );
});

Features.displayName = 'Features';

export default Features;