import { useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import ModelView from "./ModelView";
import { models } from "../constants";

const PhoneModel = () => {
  // Current category state
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const centerModel = {
    id: models[0].id,
    title: models[0].title,
    color: models[0].color[0], // Gold titanium color
  };

  // Add scroll event listener for category switching only within the component
  useEffect(() => {
    let lastScrollTime = 0;
    const handleWheel = (e: WheelEvent) => {
      // Only handle scroll if mouse is over the phone model section
      const modelSection = document.querySelector('.model-grid');
      if (!modelSection) return;
      
      const rect = modelSection.getBoundingClientRect();
      const isOverModel = e.clientX >= rect.left && e.clientX <= rect.right && 
                         e.clientY >= rect.top && e.clientY <= rect.bottom;
      
      if (!isOverModel) return;
      
      e.preventDefault(); // Only prevent default when interacting with the model
      
      const now = Date.now();
      if (now - lastScrollTime < 500) return; // Throttle
      lastScrollTime = now;
      
      if (e.deltaY > 0) {
        // Scroll down: next category
        const nextIndex = (currentCategoryIndex + 1) % models.length;
        switchCategory(nextIndex);
      } else if (e.deltaY < 0) {
        // Scroll up: previous category
        const prevIndex = (currentCategoryIndex - 1 + models.length) % models.length;
        switchCategory(prevIndex);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentCategoryIndex, models.length]);

  // Function to switch categories
  const switchCategory = (newCategoryIndex: number) => {
    if (newCategoryIndex === currentCategoryIndex) return;

    // Animate out current models
    gsap.to(".model-view", {
      opacity: 0,
      y: 30,
      duration: 0.3,
      onComplete: () => {
        setCurrentCategoryIndex(newCategoryIndex);
        // Animate in new models
        gsap.fromTo(".model-view", 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
        );
      }
    });

    // Animate category info change
    gsap.fromTo(".category-info", 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
    );
  };

  useGSAP(() => {
    gsap.to("#heading", { y: 0, opacity: 1 });
    // Animate all three models into view
    gsap.fromTo(".model-view", 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
    );
  }, [currentCategoryIndex]); // Re-run animation when category changes

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <div className="mt-5 flex flex-col items-center">
          {/* Three Models Container */}
          <div className="relative h-[75vh] w-full overflow-hidden md:h-[90vh] model-grid group cursor-pointer">
            {/* Scroll indicator */}
            <div className="absolute top-4 right-4 z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Scroll to switch categories</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 9.586V4a1 1 0 011-1z"/>
                </svg>
              </div>
            </div>
            <Canvas
              className="size-full"
              style={{ position: "fixed", top: 0, left: 0, bottom: 0, right: 0, overflow: "hidden" }}
              eventSource={document.getElementById("root") ?? undefined}
            >
              <ModelView
                item={centerModel}
                size="medium"
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhoneModel;