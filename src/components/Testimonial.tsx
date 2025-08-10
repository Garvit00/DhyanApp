"use client";
import React, { useState, useEffect } from "react";
import { fetchTestimonialData, TestimonialData, TestimonialCardStyles } from "../utils/firebaseUtils";

// Star Rating Component
interface StarRatingProps {
  count?: number;
  isActive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ count = 5, isActive = false }) => {
  const [cardStyles, setCardStyles] = useState<TestimonialCardStyles>({
    active: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Ftestimonial_card.svg?alt=media&token=46cc5b30-6ac2-4e91-95c5-169a44845943",
    inactive: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Ftestimonial_card2.svg?alt=media&token=095b7377-345c-4231-93e9-e0d1ab4675aa",
    starIcon: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Fstar.svg?alt=media&token=7242e9b8-0571-4e00-abb4-26da30bd6373"
  });

  // Fetch card styles from Firebase
  useEffect(() => {
    const loadCardStyles = async () => {
      try {
        const testimonialData = await fetchTestimonialData();
        setCardStyles(testimonialData.cardStyles);
      } catch (error) {
        // Silent error handling for production
      }
    };
    loadCardStyles();
  }, []);

  return (
    <div className="flex flex-row gap-1">
      {[...Array(count)].map((_, i) => (
        <img
          key={i}
          src={cardStyles.starIcon}
          alt="star"
          width={20}
          height={20}
          style={{ filter: isActive ? undefined : 'grayscale(1) brightness(0.7)' }}
          className="inline-block drop-shadow-sm"
        />
      ))}
    </div>
  );
};

// Testimonial Card Component
interface TestimonialCardProps {
  text: string;
  name: string;
  stars: number;
  isActive?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ text, name, stars, isActive = false }) => {
  const [cardStyles, setCardStyles] = useState<TestimonialCardStyles>({
    active: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Ftestimonial_card.svg?alt=media&token=46cc5b30-6ac2-4e91-95c5-169a44845943",
    inactive: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Ftestimonial_card2.svg?alt=media&token=095b7377-345c-4231-93e9-e0d1ab4675aa",
    starIcon: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Fstar.svg?alt=media&token=7242e9b8-0571-4e00-abb4-26da30bd6373"
  });

  // Fetch card styles from Firebase
  useEffect(() => {
    const loadCardStyles = async () => {
      try {
        const testimonialData = await fetchTestimonialData();
        setCardStyles(testimonialData.cardStyles);
      } catch (error) {
        // Silent error handling for production
      }
    };
    loadCardStyles();
  }, []);

  // Generate dynamic avatar URL based on name
  const getAvatarUrl = (name: string) => {
    // Generate dynamic avatar using UI Avatars service
    const formattedName = name.split(" ").join("+");
    const avatarUrl = `https://ui-avatars.com/api/?name=${formattedName}&background=random&color=fff&size=200&font-size=0.4&bold=true`;
    
    return avatarUrl;
  };

  const cardStyle = {
    backgroundImage: `url(${isActive ? cardStyles.active : cardStyles.inactive})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div
      className={`
        ${isActive ? 'text-white shadow-2xl' : 'text-gray-700 shadow-lg'}
        rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col items-center w-[280px] h-[320px] sm:w-[300px] sm:h-[340px] lg:w-[320px] lg:h-[360px]
        transition-all duration-500 ease-out relative overflow-hidden
      `}
      style={cardStyle}
    >
      <div className={`absolute top-4 right-4 text-2xl opacity-20 z-10 ${isActive ? 'text-white' : 'text-gray-400'}`}>"</div>
      <div className="relative z-20 flex flex-col h-full w-full">
        <p className={`text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-justify line-clamp-6 flex-1 ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
          {text}
        </p>
        <div className="flex items-center w-full gap-3 sm:gap-4 mt-auto">
          <img
            src={getAvatarUrl(name)}
            alt={name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg flex-shrink-0"
            onError={(e) => {
              // Fallback to a default avatar if the dynamic avatar fails to load
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
            }}
          />
          <div className="flex flex-col">
            <span className={`font-bold text-sm sm:text-base lg:text-lg mb-1 ${isActive ? 'text-white' : 'text-gray-800'}`}>
              {name}
            </span>
            <StarRating count={stars} isActive={isActive} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Arrow Button Component
interface ArrowButtonProps {
  direction: "left" | "right";
  onClick?: () => void;
  disabled?: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, onClick, disabled = false }) => (
  <button
    className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    aria-label={direction === "left" ? "Previous" : "Next"}
    type="button"
    onClick={onClick}
    disabled={disabled}
  >
    {direction === "left" ? (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5m0 0l7 7-7-7 7-7" /></svg>
    ) : (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14m0 0l-7-7 7 7-7 7" /></svg>
    )}
  </button>
);

// Carousel Dots Component
interface CarouselDotsProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

const CarouselDots: React.FC<CarouselDotsProps> = ({ total, current, onChange }) => (
  <div className="flex items-center justify-center gap-3">
    {[...Array(total)].map((_, index) => (
      <button key={index} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? 'bg-blue-500 scale-125' : 'bg-blue-200 hover:bg-blue-300'}`} onClick={() => onChange(index)} aria-label={`Go to testimonial ${index + 1}`} />
    ))}
  </div>
);

// Header Component
const TestimonialHeader = () => (
    <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
        <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-normal text-black mb-4"
            style={{ fontFamily: '"Gelica", sans-serif' }}
        >
            Testimonials
        </h2>
        <p
            className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto text-[#626262] font-medium"
            style={{ fontFamily: '"Gelica", sans-serif' }}
        >
            Discover how Dhyan has transformed lives and brought peace to thousands of users worldwide. Read their inspiring stories.
        </p>
    </div>
);

// Main Testimonials Component
const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Firebase
  useEffect(() => {
    const loadTestimonialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const testimonialData = await fetchTestimonialData();
        setTestimonials(testimonialData.reviews);

        // Set initial index to middle of testimonials if available
        if (testimonialData.reviews.length > 0) {
          setCurrentIndex(Math.floor(testimonialData.reviews.length / 2));
        }
      } catch (error) {
        setError("Failed to load testimonial content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonialData();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (newIndex: number) => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500); // Animation duration
  };

  const nextTestimonial = () => handleNavigation((currentIndex + 1) % testimonials.length);
  const prevTestimonial = () => handleNavigation((currentIndex - 1 + testimonials.length) % testimonials.length);
  const goToTestimonial = (index: number) => handleNavigation(index);

  const getCardStyle = (index: number) => {
    const isMobile = windowWidth < 640; // Tailwind's 'sm' breakpoint

    if (isMobile) {
      const isActive = index === currentIndex;
      return {
        transform: `scale(${isActive ? 1 : 0.9}) translateY(${isActive ? '-10px' : '0px'})`,
        zIndex: isActive ? 10 : 0,
        opacity: isActive ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isActive ? 'auto' as const : 'none' as const,
      };
    }

    let cardWidth = windowWidth < 1024 ? 300 : 320;
    // --- CHANGE ---
    // Increased the gap between cards from 30 to 40 for more spacing.
    const distance = cardWidth + 40; 
    const basePositions = [
      { x: -2 * distance, y: 80, rotation: -15, scale: 0.9, zIndex: 1, opacity: 0.7 },
      { x: -distance, y: -10, rotation: -8, scale: 1, zIndex: 5, opacity: 0.9 },
      { x: 0, y: -50, rotation: 0, scale: 1, zIndex: 10, opacity: 1 },
      { x: distance, y: -10, rotation: 8, scale: 1, zIndex: 5, opacity: 0.9 },
      { x: 2 * distance, y: 80, rotation: 15, scale: 0.9, zIndex: 1, opacity: 0.7 },
    ];

    let relativeIndex = index - currentIndex;
    if (relativeIndex > testimonials.length / 2) relativeIndex -= testimonials.length;
    if (relativeIndex < -testimonials.length / 2) relativeIndex += testimonials.length;

    const positionIndex = relativeIndex + 2;

    if (positionIndex < 0 || positionIndex >= basePositions.length) {
      return { opacity: 0, pointerEvents: 'none' as const, transform: 'scale(0)' };
    }

    const pos = basePositions[positionIndex];
    return {
      transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale}) rotate(${pos.rotation}deg)`,
      zIndex: pos.zIndex,
      opacity: pos.opacity,
      transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      pointerEvents: 'auto' as const,
    };
  };

  // Show loading state if data is not loaded yet
  if (loading) {
    return (
      <section className="w-full pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 flex flex-col items-center min-h-screen overflow-hidden relative">
        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
          <TestimonialHeader />
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading testimonials...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <section className="w-full pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 flex flex-col items-center min-h-screen overflow-hidden relative">
        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
          <TestimonialHeader />
          <div className="flex items-center justify-center h-[400px]">
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
        </div>
      </section>
    );
  }

  // Show empty state if no testimonials
  if (testimonials.length === 0) {
    return (
      <section className="w-full pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 flex flex-col items-center min-h-screen overflow-hidden relative">
        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
          <TestimonialHeader />
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <p className="text-gray-600">No testimonials available.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="Testimonials"
      className="w-full pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 flex flex-col items-center min-h-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${typeof window !== 'undefined' && window.innerWidth < 768 ? '/bg_mobile.png' : '/bg_desktop.png'})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
      }}
    >
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        <TestimonialHeader />

        <div className="relative w-full h-[400px] sm:h-[420px] md:h-[450px] lg:h-[480px] flex items-center justify-center mt-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={`${index}-${testimonial.name}`}
              className="absolute"
              style={getCardStyle(index)}
            >
              <TestimonialCard
                {...testimonial}
                isActive={index === currentIndex}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center w-full gap-4 sm:gap-8 mt-8">
            <ArrowButton direction="left" onClick={prevTestimonial} disabled={isAnimating} />
            <CarouselDots
              total={testimonials.length}
              current={currentIndex}
              onChange={goToTestimonial}
            />
            <ArrowButton direction="right" onClick={nextTestimonial} disabled={isAnimating} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;