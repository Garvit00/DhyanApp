import { useState, useEffect, forwardRef, Ref } from 'react'; // Import forwardRef and Ref
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Wrap the component in forwardRef and accept the ref as the second argument, properly typed
const Navbar = forwardRef<HTMLDivElement, any>((_, ref: Ref<HTMLDivElement>) => {
  const [sidebar, setSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebar]);

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'auto',
        block: 'start'
      });
    }
  };

  // Function to handle navigation based on the nav item
  const handleNavClick = (label: string) => {
    if (label === "Blog") {
      // If we're on the home page, scroll to blog section, otherwise navigate to blogs page
      if (location.pathname === '/') {
        scrollToSection('Blog');
      } else {
        navigate('/blogs');
      }
    } else if (label === "About") {
      // Scroll to hero section (About section)
      scrollToSection('hero');
    } else if (label === "Practices") {
      // Scroll to features section (Practices section)
      scrollToSection('features');
    } else if (label === "Testimonials") {
      // Scroll to testimonials section
      scrollToSection('Testimonials');
    } else if (label === "Contact") {
      // Scroll to contact section
      scrollToSection('contact-section');
    }
    
    // Close mobile sidebar if open
  };

  return (
    // Apply the ref here. This is the element GSAP will animate.
    <div ref={ref} className="fixed top-0 left-0 w-full z-[99999] flex justify-center pointer-events-none">
      {/* Main Navbar Container */}
      <div
        className="w-[92%] max-w-5xl px-5 md:px-10 py-4 md:py-0 rounded-[20px] md:rounded-[28px] border-[1.5px] border-[#666666] 
                   backdrop-blur-[14.95px] bg-[rgba(18,21,27,0.6)] flex items-center justify-between relative shadow-lg 
                   pointer-events-auto mt-3 sm:mt-4 h-[52px] md:h-[68px]"
        style={{
          background: 'radial-gradient(100% 100% at 100% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(100% 100% at 0% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%), rgba(18, 21, 27, 0.6)'
        }}
      >
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <div
            className="flex items-center justify-center flex-col gap-1 cursor-pointer rounded-full w-[24px] h-[24px]"
            onClick={() => setSidebar((prev) => !prev)}
          >
            <div className="bg-white rounded-3xl h-[2.5px] w-[20px]" />
            <div className="bg-white rounded-3xl h-[2.5px] w-[20px]" />
          </div>
        </div>

        {/* Brand Name */}
        <div 
          className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${isMobile ? 'absolute left-1/2 -translate-x-1/2' : ''}`}
          onClick={() => navigate('/')}
        >
          <img
            src="https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FNavbar%2Fdhyanlogo.svg?alt=media&token=b2d2d4cd-1c26-4bbe-b39d-c7520e053f6d"
            alt="DhyanApp Logo"
            className="h-[38px] w-auto md:h-[50px] md:w-[45px]"
          />
          <div className="text-white font-sfpro text-[18px] font-bold md:font-sfpro md:text-[26px] md:font-semibold">
            DhyanApp
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 text-sm font-medium text-white">
          {["About", "Practices", "Testimonials", "Blog", "Contact"].map((label) => (
            <button
              key={label}
              onClick={() => handleNavClick(label)}
              className="hover:text-[#00b4d8] transition whitespace-nowrap text-center
                         font-sfpro text-[18px] font-medium tracking-[0.25px] bg-transparent border-none cursor-pointer"
              style={{outline:'none'}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar (Framer Motion logic remains the same) */}
      <AnimatePresence>
        {sidebar && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 z-[70] w-full h-screen text-white shadow-2xl bg-[rgba(0,0,0,0.75)] backdrop-blur-[8px] overflow-hidden pointer-events-auto"
          >
            {/* Close Button */}
            <div className="absolute top-6 right-6 z-[100] pointer-events-auto">
              <button
                onClick={() => setSidebar(false)}
                className="text-white hover:text-[#00b4d8] transition-colors font-light 
                           flex items-center justify-center leading-none w-7 h-7 text-3xl"
                style={{outline:"none"}}
                tabIndex={0}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col items-center justify-center h-full px-4 gap-8">
              {/* Mobile Links */}
              {["About", "Practices", "Testimonials", "Blog", "Contact"].map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    handleNavClick(label);
                    setSidebar(false);
                  }}
                  className="hover:text-[#00b4d8] transition-colors text-[36px] font-sfpro font-light bg-transparent border-none cursor-pointer text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Set a display name for better debugging in React DevTools
Navbar.displayName = 'Navbar'; 

export default Navbar;