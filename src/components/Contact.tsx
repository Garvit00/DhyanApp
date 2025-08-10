import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const Contact = () => {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("contact-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        // Show button when contact section is in view and user has scrolled down
        const hasScrolledDown = window.scrollY > 100;
        const isContactInView = rect.top <= 0 && rect.bottom >= window.innerHeight;
        setShowTopButton(hasScrolledDown && isContactInView);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToTop = () => {
    // Use GSAP for smooth scrolling to ensure it works with all scroll triggers
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 1.2,
      ease: "power3.inOut"
    });
  };

  return (
    <section
      id="contact-section"
      className="relative flex items-start justify-center min-h-screen w-full overflow-hidden pb-40"
      style={{
        backgroundImage: `url(${typeof window !== 'undefined' && window.innerWidth < 768 ? '/bg_mobile.png' : '/bg_desktop.png'})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
      }}
    >
      {/* Responsive Rectangle Pattern Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FContact%2FRectangle11.svg?alt=media&token=33a98813-ed48-4c6f-9acf-81617ff20f7c"
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover md:object-fill"
        />
      </div>

      {/* Centered Car Image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FContact%2Fcar.svg?alt=media&token=YOUR_CAR_TOKEN"
          alt="Car"
          className="w-48 md:w-64 lg:w-80 h-auto opacity-10"
        />
      </div>

      {/* Contact Card - Centered */}
      <div className="relative flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-200 w-full max-w-[1404px] mt-[60vh]">
        {/* Left: Form Section */}
        <div className="flex flex-col justify-center px-6 py-8 md:p-16 w-full md:w-1/2 gap-5">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Get in touch
          </h1>
          <p className="text-gray-600 mb-7 text-lg">
            We are here for you! How can we help?
          </p>

          <form className="space-y-6" autoComplete="off">
            <label className="block">
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-5 py-4 text-base placeholder:text-gray-400 outline-none border border-[#D6E0FF] focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                style={{
                  borderRadius: "12px",
                  background: "#F5F8FF",
                }}
                required
              />
            </label>
            
            <label className="block">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-5 py-4 text-base placeholder:text-gray-400 outline-none border border-[#D6E0FF] focus:border-blue-100 focus:ring-2 focus:ring-blue-500 transition-all"
                style={{
                  borderRadius: "12px",
                  background: "#F5F8FF",
                }}
                required
              />
            </label>
            
            <label className="block">
              <textarea
                placeholder="Go ahead, We are listening..."
                className="w-full px-5 py-4 text-base resize-none placeholder:text-gray-400 outline-none border border-[#D6E0FF] focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                style={{
                  height: "140px",
                  borderRadius: "12px",
                  background: "#F5F8FF",
                }}
                required
              />
            </label>
            
            <button
              type="submit"
              className="w-full text-white font-medium hover:opacity-95 active:scale-[0.98] transition-all duration-200 shadow-md py-4"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(90deg, #007AFF 0%, #00B2FF 100%)",
                fontSize: "18px",
              }}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right: Contact Info */}
        <div className="flex flex-col items-center justify-center px-6 py-8 md:p-16 w-full md:w-1/2 gap-8 bg-[#F5F8FF]">
          <div className="flex flex-col items-center gap-8">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FContact%2Fyogi.svg?alt=media&token=649cc42d-e730-4147-8f71-0c9121deedea"
              alt="Contact us"
              className="w-[200px] md:w-[280px] h-auto"
            />

            <div className="space-y-6 w-full max-w-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FContact%2Flocation.svg?alt=media&token=a81a4bd6-bca6-461f-a98b-ba75bea138e7"
                    alt="Location"
                    className="w-5 h-5"
                  />
                </div>
                <p className="text-gray-800 leading-relaxed text-base">
                  #2397/29A, 18th Main Road, <br />
                  Kumaraswamy Layout - Stage II, <br />
                  Bengaluru, Karnataka - 560078
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FContact%2Fmail.svg?alt=media&token=ab33c236-cdaa-4536-85d8-f8b82f806fd8"
                    alt="Email"
                    className="w-5 h-5"
                  />
                </div>
                <p className="text-gray-800 text-base">
                  contact@epilepto.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Link - Positioned at bottom */}
      {showTopButton && (
        <div className="absolute bottom-10 right-10 z-20">
          <button
            onClick={handleBackToTop}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors font-medium text-lg bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            Back to top
            <img src="/arrow-up.svg" alt="Up arrow" className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Contact;