import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchSocialData, SocialData } from "../utils/firebaseUtils";

gsap.registerPlugin(ScrollTrigger);

const Social = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [mockupData, setMockupData] = useState<SocialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastScrollY = useRef(0);
  const scrollThreshold = 50; 

  useEffect(() => {
    const loadSocialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const socialData = await fetchSocialData();
        setMockupData(socialData);
      } catch (error) {
        setError("Failed to load social content. Please try again later.");
        setMockupData([]);
      } finally {
        setLoading(false);
      }
    };

    loadSocialData();
  }, []);

  useEffect(() => {
    if (!isAutoScrolling || mockupData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mockupData.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, [isAutoScrolling, mockupData.length]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;
      
      isScrolling = true;
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      
              if (scrollDelta > scrollThreshold && mockupData.length > 0) {
          const isScrollingDown = currentScrollY > lastScrollY.current;
          
          if (isScrollingDown) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % mockupData.length);
          } else {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + mockupData.length) % mockupData.length);
          }
        
        setIsAutoScrolling(false);
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsAutoScrolling(true);
        }, 3000);
      }
      
      lastScrollY.current = currentScrollY;
      
      setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('wheel', throttledScrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('wheel', throttledScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [mockupData.length]);

  useEffect(() => {
    const context = gsap.context(() => {
      const container = containerRef.current;
      const section = sectionRef.current;
      const imageContainer = imageContainerRef.current;
      const iphoneElement = document.querySelector('.iphone-transition-element');

      if (!container || !section || !imageContainer) return;

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        gsap.set(container, { height: `${mockupData.length * 100}vh` });
        
        const sections = gsap.utils.toArray(".mobile-section");
        
        sections.forEach((section: any, i) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              setCurrentIndex(i);
              setIsAutoScrolling(false);
            },
            onEnterBack: () => {
              setCurrentIndex(i);
              setIsAutoScrolling(false);
            },
          });
        });

        // Auto-scroll animation for mobile
        if (isAutoScrolling) {
          gsap.to(imageContainer, {
            yPercent: -currentIndex * 100,
            duration: 1.2,
            ease: "power2.inOut",
          });
        }
      } else {
        // Enhanced desktop animation with smooth transition to Features
        gsap.set(container, { height: `${mockupData.length * 100}vh` });

        // Kill previous ScrollTrigger if it exists
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
        }

        const masterTimeline = gsap.timeline({ paused: true });

        // Create smooth transition to Features section
        masterTimeline.to(
          imageContainer,
          {
            yPercent: (-100 * (mockupData.length - 1)) / mockupData.length,
            ease: "none",
          },
          0
        );

        // Smooth transition to Features section without cuts
        ScrollTrigger.create({
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          onLeaveBack: () => {
            // When scrolling up from Features back to Social
            if (iphoneElement) {
              gsap.to(iphoneElement, {
                y: 0,
                x: 0,
                scale: 1,
                duration: 2,
                ease: "power3.out",
              });
            }
          },
          onEnter: () => {
            // When scrolling down from Social to Features - smooth transition
            if (iphoneElement) {
              gsap.to(iphoneElement, {
                y: -50,
                x: 100,
                scale: 0.9,
                duration: 2,
                ease: "power3.out",
              });
            }
          }
        });

        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          pin: section,
          animation: masterTimeline,
          onUpdate: (self) => {
            const newIndex = Math.floor(self.progress * mockupData.length);
            if (newIndex < mockupData.length) {
              setCurrentIndex(newIndex);
              // Disable auto-scroll when user manually scrolls
              setIsAutoScrolling(false);
            }
          },
        });

        // Auto-scroll animation when not manually scrolling
        if (isAutoScrolling && scrollTriggerRef.current && !scrollTriggerRef.current.isActive) {
          gsap.to(imageContainer, {
            yPercent: -currentIndex * (100 / mockupData.length),
            duration: 2,
            ease: "power3.out",
          });
        }
      }
    });

    return () => context.revert();
  }, [mockupData.length, currentIndex, isAutoScrolling]);

  // Re-enable auto-scroll after user stops interacting
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleInteraction = () => {
      setIsAutoScrolling(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 10000); // Re-enable auto-scroll after 10 seconds of inactivity
    };

    window.addEventListener("scroll", handleInteraction);
    window.addEventListener("wheel", handleInteraction);
    window.addEventListener("touchmove", handleInteraction);

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
      clearTimeout(timeout);
    };
  }, []);

  // Show loading state if data is not loaded yet
  if (loading) {
    return (
      <div className="social-container relative pb-12 md:pb-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading social content...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="social-container relative pb-12 md:pb-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (mockupData.length === 0) {
    return (
      <div className="social-container relative pb-12 md:pb-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No social content available.</p>
        </div>
      </div>
    );
  }

  // Ensure currentIndex is within bounds
  const validCurrentIndex = Math.min(currentIndex, mockupData.length - 1);

  return (
    <div
      id="Social"
      ref={containerRef}
      className="social-container relative pb-12 md:pb-32"
      style={{
        backgroundImage: `url(${typeof window !== 'undefined' && window.innerWidth < 768 ? '/bg_mobile.png' : '/bg_desktop.png'})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        position: 'relative',
        zIndex: 1
      }}
    >

      {/* Mobile Layout */}
      <div className="md:hidden w-full">
        {mockupData.map((item, index) => (
          <div 
            key={index}
            className="mobile-section min-h-screen w-full flex flex-col items-center justify-start pt-20 px-4"
          >
            <div className="w-full max-w-[600px] text-left mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={validCurrentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: validCurrentIndex === index ? 1 : 0, y: validCurrentIndex === index ? 0 : 20 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                >
                  <h1 className="text-2xl sm:text-3xl font-normal text-black mb-4 md:mb-6" style={{ fontFamily: "Gelica, serif" }}>
                    {item.heading}
                  </h1>
                  <p className="text-base sm:text-lg text-[#626262] font-medium leading-relaxed" style={{ fontFamily: '"SF Pro Display", sans-serif' }}>
                    {item.paragraph}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="relative w-[220px] h-[450px] -ml-5">
              <motion.img
                src={item.image}
                alt={item.heading}
                className="w-full h-full object-contain iphone-transition-element"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: validCurrentIndex === index ? 1 : 0.85,
                  opacity: validCurrentIndex === index ? 1 : 0.2,
                  y: validCurrentIndex === index ? 0 : (index < validCurrentIndex ? -10 : 10)
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 1, 0.5, 1],
                  delay: index === validCurrentIndex ? 0 : 0.1
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div
          ref={sectionRef}
          className="min-h-screen w-full flex items-center justify-center overflow-hidden"
        >
          <div className="relative z-20 w-full h-full flex flex-col md:flex-row items-center justify-center">
            {/* Text Section */}
            <div className="relative md:absolute md:top-1/3 md:-translate-y-1/3 md:left-[143px] w-full md:max-w-[600px] text-left px-4 md:px-0 mb-8 md:mb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={validCurrentIndex}
                  initial={{ opacity: 0, x: -30, y: 0 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 30, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                >
                  <h1 className="text-3xl sm:text-3xl md:text-[62px] font-normal text-black mb-4 md:mb-6" style={{ fontFamily: "Gelica, serif" }}>
                    {mockupData[validCurrentIndex]?.heading || "Loading..."}
                  </h1>
                  <p className="text-base sm:text-lg md:text-[22px] text-[#626262] font-medium leading-relaxed md:leading-[30px]" style={{ fontFamily: '"SF Pro Display", sans-serif' }}>
                    {mockupData[validCurrentIndex]?.paragraph || "Loading description..."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image Section */}
            <div className="w-full flex justify-center md:block md:absolute md:top-1/2 md:-translate-y-1/2 md:left-[1148px] md:right-[325px]">
              <div
                className="relative w-[220px] h-[450px] sm:w-[300px] sm:h-[600px] md:w-[416px] md:h-[852px]"
                style={{ width: undefined, height: undefined }}
              >
                <div
                  ref={imageContainerRef}
                  className="absolute top-0 left-0 w-full"
                  style={{ height: `${mockupData.length * 100}%` }}
                >
                  {mockupData.map((item, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex items-center justify-center py-4 md:py-8"
                      style={{ height: `${100 / mockupData.length}%` }}
                    >
                      <motion.img
                        src={item.image}
                        alt={item.heading}
                        className="w-full h-full object-contain iphone-transition-element"
                        style={{ maxWidth: "416px", maxHeight: "852px" }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ 
                          scale: validCurrentIndex === index ? 1 : 0.85,
                          opacity: validCurrentIndex === index ? 1 : 0.2,
                          y: validCurrentIndex === index ? 0 : (index < validCurrentIndex ? -10 : 10)
                        }}
                        transition={{ 
                          duration: 0.6, 
                          ease: [0.25, 1, 0.5, 1],
                          delay: index === validCurrentIndex ? 0 : 0.1
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;