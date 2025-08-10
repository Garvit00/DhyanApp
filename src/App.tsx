import { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Social from './components/Social';
import Testimonial from './components/Testimonial';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Blogs } from './components/pages/Blogs';
import BlogPage from './components/pages/BlogPage';
import { useAutoScroll } from './utils/useAutoScroll';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const App = () => {
  const navbarRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Ensure page starts from top on every route change
    window.scrollTo(0, 0);
    
    // Also handle page refresh
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
    /* ---- 2️⃣  Navbar hide/show with blur fade ---- */
    ScrollTrigger.create({
      trigger: '#features',
      start: 'top top',
      end: 'bottom top',
      onEnter: () =>
        gsap.to(navbarRef.current, {
          yPercent: -100,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
        }),
      onLeaveBack: () =>
        gsap.to(navbarRef.current, {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        }),
      onLeave: () =>
        gsap.to(navbarRef.current, {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        }),
    });

    // Listen for custom event to hide navbar
    const hideNavbar = () => {
      gsap.to(navbarRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    };
    window.addEventListener('hideNavbar', hideNavbar);

    /* ---- 3️⃣  Global refresh ---- */
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      clearTimeout(t);
      window.removeEventListener('hideNavbar', hideNavbar);
    };
  }, []);

  // Auto-scroll from Hero to Features
  const { } = useAutoScroll({
    heroRef: heroRef as React.RefObject<HTMLElement>,
    featuresRef: featuresRef as React.RefObject<HTMLElement>,
    threshold: 0.8, // Trigger when 80% through hero section
    enabled: true,
    onAutoScrollStart: () => {
      console.log('Auto-scroll from Hero to Features started');
    },
    onAutoScrollComplete: () => {
      console.log('Auto-scroll from Hero to Features completed');
    }
  });

  // Debug refs
  useEffect(() => {
    console.log('Hero ref:', heroRef.current);
    console.log('Features ref:', featuresRef.current);
  }, [heroRef.current, featuresRef.current]);

  const HomePage = () => (
    <div className="main-container relative" style={{ zIndex: 1 }}>
      {/* @ts-ignore */}
      <Navbar ref={navbarRef} />
      <Hero ref={heroRef} />
      <Features ref={featuresRef as React.Ref<HTMLDivElement>} />
      <Social />
      <Testimonial />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blog/:id" element={<BlogPage />} />
    </Routes>
  );
};

export default App;