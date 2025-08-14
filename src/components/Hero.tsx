import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useEffect, useState, useRef, forwardRef } from "react";
import { useMediaQuery } from "react-responsive";
import HeroPhone from "./HeroPhone";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Canvas } from "@react-three/fiber";
import InteractiveStars from "./InteractiveStars";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface HeroContent {
  title: string;
  subtitle: string;
  downloadText: string;
  videoBg: string; 
  stores: {
    appleAppStore: {
      imageUrl: string;
      link: string;
    };
    "googlePlay ": { 
      imageUrl: string;
      link: string;
    };
  };
  phoneMockup: {
    frameUrl: string;
    screens: string[];
  };
}

const Hero = forwardRef<HTMLElement>((_, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);

  
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Ensure page starts from top on load
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Also scroll to top when the page is refreshed
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollToTop', 'true');
    };
    
    const handleLoad = () => {
      if (sessionStorage.getItem('scrollToTop') === 'true') {
        window.scrollTo(0, 0);
        sessionStorage.removeItem('scrollToTop');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);





  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setInitialRender(false);
      setIsInitialMount(false);
      document.body.style.overflow = '';
    }, 800); 
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const docRef = doc(
          firestore,
          "Website_New",
          "86TJ2c4q1WqM1sqYXgKJ",
          "Hero",
          "mainPageContent"
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as HeroContent;
          setHeroContent(data);
          
          const imagesToPreload = [
            data.stores?.appleAppStore?.imageUrl,
            data.stores?.["googlePlay "]?.imageUrl,
            ...(data.phoneMockup?.screens || []),
            '/images/frame.png' 
          ].filter(Boolean);
          
          const imagePromises = imagesToPreload.map(src => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = src;
            });
          });
          
          try {
            await Promise.all(imagePromises);
            setImagesPreloaded(true);
          } catch (error) {
            console.error("Error preloading images:", error);
            setImagesPreloaded(true); 
          }
        } else {
          console.log("No document found in Firebase");
          setHeroContent({} as HeroContent); 
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
        setHeroContent({} as HeroContent); 
      } finally {
        setLoading(false);
      }
    };
    fetchHeroContent();
  }, []);

  const isReady = heroContent && imagesPreloaded && modelReady && !initialRender && !isInitialMount;

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  useEffect(() => {
    if (heroContent && imagesPreloaded && !modelReady && !initialRender) {
      const fallbackTimer = setTimeout(() => {
        setModelReady(true);
      }, 4000); 
      return () => clearTimeout(fallbackTimer);
    }
  }, [heroContent, imagesPreloaded, modelReady, initialRender]);

  useGSAP(() => {
    if (!showContent) return;

    gsap.from(".title", {
      opacity: 0,
      yPercent: 100,
      duration: 1.5,
      ease: "expo.out",
    });
    gsap.from(".subtitle", {
      opacity: 0,
      yPercent: 100,
      duration: 1.5,
      ease: "expo.out",
      delay: 0.5,
    });
    
    gsap.from(".phone-entrance", {
      opacity: 0,
      scale: 1.0, 
      y: 40,
      rotationY: 15,
      duration: 1.8,
      ease: "expo.out",
      delay: 1.0,
      transformOrigin: "center bottom",
    });

    // Video background animations
    if (videoRef.current) {
      const video = videoRef.current;
      let scrollTimeout: NodeJS.Timeout;
      let isScrolling = false;
      
      video.pause();
      video.currentTime = 0;
      
      const handleScrollVideo = () => {
        clearTimeout(scrollTimeout);
        
        if (!isScrolling) {
          isScrolling = true;
          video.play().catch(console.error);
        }
        
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
          video.pause();
        }, 150); 
      };
      
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top bottom",
        end: "bottom top",
        onUpdate: handleScrollVideo,
        onEnter: () => {
          video.currentTime = 0;
        },
        onLeave: () => {
          video.pause();
          video.currentTime = 0;
          clearTimeout(scrollTimeout);
          isScrolling = false;
        },
        onEnterBack: () => {
          video.currentTime = 0;
        },
        onLeaveBack: () => {
          video.pause();
          video.currentTime = 0;
          clearTimeout(scrollTimeout);
          isScrolling = false;
        },
      });
    }

    if (videoContainerRef.current) {
      ScrollTrigger.create({
        trigger: "#hero",
        start: "bottom top",
        onEnter: () =>
          gsap.to(videoContainerRef.current, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.out",
          }),
        onLeaveBack: () =>
          gsap.to(videoContainerRef.current, {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.inOut",
          }),
      });
    }
  }, [showContent]);

  if (isInitialMount || loading || !isReady) {
    return (
      <>
        <div 
          className="fixed inset-0 z-[9999] bg-black"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            paddingTop: '80px' 
          }}
        />
        <div
          className={`loading-screen fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black transition-opacity duration-500 ${
            showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ 
            backgroundImage: "url('/images/frame.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            minHeight: '100vh',
            width: '100vw',
            backdropFilter: 'blur(10px)',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            paddingTop: '80px' 
          }}
        >
        {/* Overlay to ensure complete coverage */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
        
        {/* iPhone Model Loading Experience */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen" style={{ paddingTop: '80px' }}>
          
          {/* iPhone Silhouette with Loading Animation */}
          <div className="relative mb-12">
            {/* Outer glow ring */}
          <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[320px] h-[320px] rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-pulse-glow blur-xl"></div>
          </div>
            
            {/* Rotating gradient ring */}
          <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[280px] h-[280px] rounded-full p-1">
                <div className="w-full h-full rounded-full bg-gradient-conic from-white/20 via-white/10  to-white/20 animate-spin-slow relative">
                  <div className="absolute inset-1 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* iPhone Mockup */}
            <div className="relative z-10 flex items-center justify-center w-[280px] h-[280px]">
              <div className="relative transform animate-float-smooth">
                {/* iPhone frame with gradient border */}
                <div className="relative w-[120px] h-[240px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[24px] p-1 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-black rounded-[20px] overflow-hidden relative">
                    {/* Screen glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 animate-pulse"></div>
                    
                    {/* App Preview Animation */}
                    <div className="absolute inset-2 flex flex-col items-center justify-center text-white">
                      {/* App Icon */}
                      <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-xl mb-3 animate-pulse-scale-custom flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/80 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Loading bars animation */}
                      <div className="flex gap-1 mb-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-white/60 to-white/40 rounded-full animate-pulse"
                            style={{
                              height: `${12 + (i * 4)}px`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          ></div>
                        ))}
                      </div>
                      
                      {/* Progress dots */}
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Screen reflection */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
                  </div>
                  
                  {/* Home indicator */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full"></div>
                </div>
                
                {/* Floating particles around iPhone */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full animate-float-particles"
                    style={{
                      top: `${20 + (i * 15)}%`,
                      left: `${i % 2 === 0 ? -10 : 110}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${2 + (i % 3)}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Enhanced Loading Text */}
          <div className="text-center space-y-15 mb-24">
            <div className="text-white/90 font-light tracking-[0.4em] text-lg">
              <span className="inline-block animate-typewriter-smooth">PREPARING</span>
              <span className="text-white/60 animate-dots-elegant">...</span>
            </div>
            <div className="text-white/70 text-sm tracking-wider mt-4">
              Your meditation experience
            </div>
            
            {/* Loading progress with iPhone icon */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-4 h-6 border border-white/30 rounded-sm relative">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/60 to-white/40 rounded-sm animate-progress-vertical"></div>
              </div>
              <div className="text-white/60 text-xs font-medium tracking-wide">
                Loading 3D Model
              </div>
            </div>
          </div>
          
          {/* Feature Preview Pills - Better positioning with more space */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex justify-center gap-2 sm:gap-4 max-w-full px-4">
            {['Meditation', 'Mantra', 'Pranayama', 'Knowledge', 'Yoga'].map((feature, i) => (
              <div
                key={feature}
                className={`backdrop-blur-sm border rounded-full font-medium animate-fade-in hover:bg-white/15 transition-all duration-300 relative
                           px-2 py-1 text-xs md:px-4 md:py-2 md:text-sm
                  ${feature === 'Pranayama' 
                    ? 'bg-white/20 border-white/40 text-white/90' 
                    : 'bg-white/10 border-white/20 text-white/80'
                }`}
                style={{ animationDelay: `${i * 0.5 + 1}s` }}
              >
                {feature}
                {/* Selection indicator for Pranayama */}
                {feature === 'Pranayama' && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        

        
        {/* Interactive Stars Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
          >
            <InteractiveStars mouse={mouse} />
          </Canvas>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div ref={videoContainerRef} className="fixed inset-0 z-50 w-full h-full pointer-events-none">
        <video
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          poster="/images/frame.png" 
          className="w-full h-full object-cover pointer-events-none"
        >
          <source src="/videos/hero-bg.webm" type="video/webm" />
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* Hero background overlay to block Features */}
      <div 
        className="fixed inset-0 bg-black"
        style={{ 
          zIndex: 60,
          opacity: showContent ? 0 : 1,
          transition: 'opacity 0.5s ease',
          pointerEvents: showContent ? 'none' : 'auto'
        }}
      />
      
      <section
        id="hero"
        ref={(element) => {
          heroSectionRef.current = element;
          if (ref) {
            if (typeof ref === 'function') {
              ref(element);
            } else {
              ref.current = element;
            }
          }
        }}
        className={`relative flex flex-col md:flex-row items-center justify-center min-h-screen z-20 pt-[50px] mt-0 pb-4 sm:pb-8 md:pb-0 text-center overflow-hidden transition-opacity duration-700 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          animationDuration: '0.8s', 
          animationFillMode: 'both',
          zIndex: 100,
          position: 'relative',
          minHeight: '100vh', // Ensure minimum height for ScrollTrigger
          height: '100vh' // Force exact height
        }}
      >

        <div className="absolute inset-0 z-0 pointer-events-none flex justify-end h-full">
          <div
            className={`h-full ${
              isMobile
                ? "w-[60vw] translate-x-[5%] max-w-[300px] min-w-[150px]"
                : "w-1/2 translate-x-[20%] min-w-[300px]"
            }`}
          />
        </div>
        <div
          className="relative z-30 flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 xl:px-30 pt-12 sm:pt-16 md:pt-25 max-w-[1200px] mx-auto"
          style={{ marginTop: "2em" }}
        >
          <div className="w-full ">
            {isMobile ? (
              <div className="text-center relative z-30">
                <div
                  style={{
                    color: "white",
                    fontSize: "60px",
                    fontFamily: "Samarkan",
                    fontWeight: "400",
                    marginBottom: "8px",
                    marginTop: "13rem",
                  }}
                >
                  {heroContent.title}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: "26px",
                    fontFamily: "Sweet Romance",
                    fontWeight: "400",
                    lineHeight: "50px",
                    marginBottom: "8px",
                  }}
                >
                  {heroContent.subtitle}
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: "24px",
                    fontFamily: "SF Pro Display",
                    fontWeight: "500",
                    marginBottom: "6px",
                  }}
                >
                  {heroContent.downloadText}
                </div>
              </div>
            ) : (
              <>
                <h1
                  className="text-white font-[Samarkan] font-normal leading-none mb-2 title text-left relative z-30"
                  style={{ fontSize: "clamp(5rem, 10vw, 7rem)",
                  lineHeight: 1.1,
                  textShadow: "rgba(0, 0, 0, 0.5) 2px 2px 4px",
                  transform: "translate(0px, 0px)",
                  opacity: 1 }}
                >
                  {heroContent.title}
                </h1>
                <div
                  className="w-full flex flex-col items-start relative z-20"
                  style={{ paddingLeft: "10px" }}
                >
                  <h2
                    className="text-white font-[Sweet Romance] subtitle text-left font-normal"
                    style={{
                      fontSize: "3rem",
                      lineHeight: "4rem",
                    }}
                  >
                    {heroContent.subtitle}
                  </h2>
                  <div className="flex flex-col items-center" style={{ marginTop: "40px" }}>
                    <div
                      style={{
                        color: "white",
                        fontSize: "1.6rem",
                        fontFamily: `"SF Pro Display"`,
                        fontWeight: 500
                      }}
                    >
                      {heroContent.downloadText}
                    </div>
                    <div className="mt-4 flex gap-2 relative z-30">
                      {heroContent.stores?.["googlePlay "]?.link ? (
                        <a 
                          href={heroContent.stores["googlePlay "].link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative z-30"
                        >
                          <img
                            src={heroContent.stores["googlePlay "].imageUrl}
                            alt="Google Play"
                            className="h-8 sm:h-10 md:h-12"
                          />
                        </a>
                      ) : (
                        <div className="relative z-30">
                          <img
                            src={heroContent.stores?.["googlePlay "].imageUrl}
                            alt="Google Play"
                            className="h-8 sm:h-10 md:h-12"
                          />
                        </div>
                      )}
                      {heroContent.stores?.appleAppStore?.link ? (
                        <a 
                          href={heroContent.stores.appleAppStore.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative z-30"
                        >
                          <img
                            src={heroContent.stores.appleAppStore.imageUrl}
                            alt="App Store"
                            className="h-8 sm:h-10 md:h-12"
                          />
                        </a>
                      ) : (
                        <div className="relative z-30 opacity-50">
                          <img
                            src={heroContent.stores.appleAppStore.imageUrl}
                            alt="App Store Coming Soon"
                            className="h-8 sm:h-10 md:h-12"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {isMobile && (
            <div className="mt-1 mb-2 text-center w-full relative z-30">
              <div className="flex justify-center gap-2">
                {heroContent.stores?.["googlePlay "]?.link ? (
                  <a 
                    href={heroContent.stores["googlePlay "].link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative z-30"
                  >
                    <img src={heroContent.stores["googlePlay "].imageUrl} alt="Google Play" className="h-12" />
                  </a>
                ) : (
                  <div className="relative z-30">
                    <img src={heroContent.stores?.["googlePlay "].imageUrl} alt="Google Play" className="h-12" />
                  </div>
                )}
                {heroContent.stores?.appleAppStore?.link ? (
                  <a 
                    href={heroContent.stores.appleAppStore.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative z-30"
                  >
                    <img src={heroContent.stores.appleAppStore.imageUrl} alt="App Store" className="h-12" />
                  </a>
                ) : (
                  <div className="relative z-30 opacity-50">
                    <img src={heroContent.stores.appleAppStore.imageUrl} alt="App Store Coming Soon" className="h-12" />
                  </div>
                )}
              </div>
            </div>
          )}

          {isMobile && (
            <div
              className="flex justify-center w-full scale-90 mt-0 mb-0 relative z-30 phone-entrance"
              style={{
                width: "500px",
                height: "750px",
                marginTop: "-80px",
                touchAction: 'pan-y'
              }}
            >
              <HeroPhone 
                screens={heroContent.phoneMockup?.screens} 
                onModelLoaded={() => setModelReady(true)}
              />
            </div>
          )}
        </div>
        {!isMobile && (
          <div className="flex-1 w-full flex items-center justify-center md:justify-end md:pr-12 mt-8 sm:mt-12 md:mt-24 md:-ml-[30px] relative z-30 phone-entrance">
            <HeroPhone 
              screens={heroContent.phoneMockup?.screens} 
              onModelLoaded={() => setModelReady(true)}
            />
          </div>
        )}
      </section>
    </>
  );
});

Hero.displayName = 'Hero';

export default Hero;