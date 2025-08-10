// Auto-scroll hook for Hero to Features transition
// Add this to your src/utils directory as useAutoScroll.ts

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface UseAutoScrollProps {
  heroRef: React.RefObject<HTMLElement>;
  featuresRef?: React.RefObject<HTMLElement>;
  threshold?: number; // Percentage of hero section scrolled before triggering
  enabled?: boolean;
  onAutoScrollStart?: () => void;
  onAutoScrollComplete?: () => void;
}

export const useAutoScroll = ({
  heroRef,
  featuresRef,
  threshold = 0.15, // Trigger when 15% through hero
  enabled = true,
  onAutoScrollStart,
  onAutoScrollComplete
}: UseAutoScrollProps) => {
  const hasTriggeredRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!enabled || !heroRef.current) return;

    // Reset trigger when scrolling back to top
    const resetTrigger = () => {
      if (window.scrollY < 100) {
        hasTriggeredRef.current = false;
      }
    };

    const createAutoScrollTrigger = () => {
      const heroElement = heroRef.current;
      if (!heroElement) {
        console.log('Hero element not found for auto-scroll');
        return;
      }

      console.log('Creating auto-scroll trigger for hero element:', heroElement);

      // Clean up existing trigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      // Create a more reliable trigger that detects when user scrolls past the hero
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: heroElement,
        start: "top top", // Start when hero top reaches viewport top
        end: "bottom top", // End when hero bottom reaches viewport top
        onUpdate: (self) => {
          console.log('ScrollTrigger update - progress:', self.progress, 'direction:', self.direction);
          // Trigger when user has scrolled past 80% of the hero section
          if (!hasTriggeredRef.current && 
              !isAutoScrollingRef.current && 
              self.progress > 0.8 && 
              self.direction === 1) { // Scrolling down
            console.log('Triggering auto-scroll from onUpdate');
            triggerAutoScroll();
          }
        },
        onLeave: () => {
          console.log('Hero section left viewport');
          // Also trigger when user leaves the hero section completely
          if (!hasTriggeredRef.current && !isAutoScrollingRef.current) {
            console.log('Triggering auto-scroll from onLeave');
            triggerAutoScroll();
          }
        },
        onEnter: () => {
          console.log('Hero section entered viewport');
        },
        onEnterBack: () => {
          console.log('Hero section entered viewport from back');
        },
        onLeaveBack: () => {
          console.log('Hero section left viewport going back');
        }
      });

      console.log('ScrollTrigger created successfully:', scrollTriggerRef.current);
    };

    const triggerAutoScroll = () => {
      if (hasTriggeredRef.current || isAutoScrollingRef.current) {
        console.log('Auto-scroll already triggered or in progress, skipping');
        return;
      }

      console.log('Starting auto-scroll to features');
      hasTriggeredRef.current = true;
      isAutoScrollingRef.current = true;
      onAutoScrollStart?.();

      // Temporarily disable smooth scrolling to prevent conflicts with GSAP
      const htmlElement = document.documentElement;
      const originalScrollBehavior = htmlElement.style.scrollBehavior;
      htmlElement.style.scrollBehavior = 'auto';

      // Determine target: either Features section or next section after hero
      let targetElement = featuresRef?.current;
      if (!targetElement) {
        // Fallback: find next section after hero
        const heroElement = heroRef.current;
        if (heroElement && heroElement.nextElementSibling) {
          targetElement = heroElement.nextElementSibling as HTMLElement;
        }
      }

      console.log('Target element for auto-scroll:', targetElement);

      if (targetElement) {
        // Use GSAP ScrollToPlugin for smooth scrolling
        console.log('Scrolling to features element');
        gsap.to(window, {
          duration: 1.5, // Slightly longer duration for smoother transition
          scrollTo: {
            y: targetElement,
            offsetY: 0,
          },
          ease: "power2.inOut",
          onComplete: () => {
            console.log('Auto-scroll completed');
            isAutoScrollingRef.current = false;
            onAutoScrollComplete?.();
            
            // Restore original scroll behavior
            htmlElement.style.scrollBehavior = originalScrollBehavior;
            
            // Refresh ScrollTrigger after auto-scroll
            setTimeout(() => ScrollTrigger.refresh(), 100);
          }
        });
      } else {
        // Fallback: scroll to next viewport
        console.log('No target element found, scrolling to next viewport');
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: window.innerHeight,
            offsetY: 0,
          },
          ease: "power2.inOut",
          onComplete: () => {
            console.log('Auto-scroll to viewport completed');
            isAutoScrollingRef.current = false;
            onAutoScrollComplete?.();
            
            // Restore original scroll behavior
            htmlElement.style.scrollBehavior = originalScrollBehavior;
            
            setTimeout(() => ScrollTrigger.refresh(), 100);
          }
        });
      }
    };

    // Create the scroll trigger
    createAutoScrollTrigger();

    // Add reset listener
    window.addEventListener('scroll', resetTrigger, { passive: true });

    // Refresh ScrollTrigger after a short delay to ensure proper initialization
    setTimeout(() => {
      console.log('Refreshing ScrollTrigger after initialization');
      ScrollTrigger.refresh();
    }, 500);

    // Cleanup
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      window.removeEventListener('scroll', resetTrigger);
    };
  }, [heroRef, featuresRef, threshold, enabled, onAutoScrollStart, onAutoScrollComplete]);

  // Reset function for manual use
  const resetAutoScroll = () => {
    hasTriggeredRef.current = false;
    isAutoScrollingRef.current = false;
  };

  return {
    resetAutoScroll,
    hasTriggered: hasTriggeredRef.current,
    isAutoScrolling: isAutoScrollingRef.current
  };
};

// Alternative simpler version for direct integration
export const setupHeroAutoScroll = (heroSelector: string = '#hero', featuresSelector: string = '#features') => {
  let hasTriggered = false;
  let isScrolling = false;

  const trigger = ScrollTrigger.create({
    trigger: heroSelector,
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => {
      if (!hasTriggered && !isScrolling && self.progress > 0.8 && self.direction === 1) {
        hasTriggered = true;
        isScrolling = true;

        const featuresElement = document.querySelector(featuresSelector);
        if (featuresElement) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: {
              y: featuresElement,
              offsetY: 0,
            },
            ease: "power2.inOut",
            onComplete: () => {
              isScrolling = false;
              ScrollTrigger.refresh();
            }
          });
        }
      }
    },
    onLeave: () => {
      if (!hasTriggered && !isScrolling) {
        hasTriggered = true;
        isScrolling = true;

        const featuresElement = document.querySelector(featuresSelector);
        if (featuresElement) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: {
              y: featuresElement,
              offsetY: 0,
            },
            ease: "power2.inOut",
            onComplete: () => {
              isScrolling = false;
              ScrollTrigger.refresh();
            }
          });
        }
      }
    }
  });

  // Reset when scrolling back to top
  const resetListener = () => {
    if (window.scrollY < 100) {
      hasTriggered = false;
    }
  };

  window.addEventListener('scroll', resetListener, { passive: true });

  // Return cleanup function
  return () => {
    trigger.kill();
    window.removeEventListener('scroll', resetListener);
  };
};
