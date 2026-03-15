import { properties } from "./data";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

const RollingNumber = ({ value }) => {
  const count = useMotionValue(0);
  const ref = useRef(null); // Reference to watch this specific number
  const isInView = useInView(ref, { once: true, margin: "-100px" }); // Triggers when 100px into view

  const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const suffix = value.replace(/[0-9.]/g, "");

  const rounded = useTransform(count, (latest) => {
    return latest % 1 === 0 ? Math.round(latest) : latest.toFixed(1);
  });

  const runAnimation = (speed) => {
    count.set(0);
    animate(count, numericValue, {
      duration: speed,
      ease: "easeOut",
    });
  };

  // 2. The trigger now depends on 'isInView'
  useEffect(() => {
    if (isInView) {
      runAnimation(2);
    }
  }, [isInView, numericValue]);

  const handleHover = () => {
    runAnimation(1);
  };

  return (
    // 3. Attach the 'ref' here
    <motion.span
      ref={ref}
      onMouseEnter={handleHover}
      whileHover={{ scale: 1.1, color: "#1e3a8a" }}
      whileTap={{ scale: 0.9 }}
      className="cursor-pointer inline-block"
    >
      {value.startsWith("£") ? "£" : ""}
      <motion.span>{rounded}</motion.span>
      {suffix.replace("£", "")}
    </motion.span>
  );
};

function App() {
  // This state stores the property object when a user clicks 'View Details'
  const [selectedProperty, setSelectedProperty] = useState(null);

  const openModal = (property) => {
    setSelectedProperty(property);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedProperty(null);
    document.body.style.overflow = "unset";
  };

  const [showBackToTop, setShowBackToTop] = useState(false);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If we've scrolled more than 50px, shrink the logo
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [count, setCount] = useState(0);

  const stats = [
    { label: "Properties Managed", value: "2" },
    { label: "Portfolio Value", value: "£200k+" },
    { label: "Annual Yield", value: "8.4%" },
    { label: "Successful Flips", value: "1" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-6 ${
          isScrolled
            ? "py-2 bg-white/65 backdrop-blur-sm shadow-md"
            : "py-6 md:py-8 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Left Side: Desktop Links / Mobile Empty */}
          <div
            className={`hidden md:flex space-x-6 font-medium text-s uppercase tracking-widest transition-colors duration-500 ${
              isScrolled ? "text-slate-600" : "text-white"
            }`}
          >
            <a href="#portfolio" className="hover:text-blue-400">
              Portfolio
            </a>
            <a href="#about" className="hover:text-blue-400">
              About Us
            </a>
          </div>
          <div className="md:hidden"></div> {/* Spacer for mobile grid */}
          {/* Center: The Pop-out Logo (Mobile Adjusted) */}
          <div className="flex justify-center relative">
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                // Trigger "small" mode if scrolled OR if mobile menu is open
                isScrolled || isMenuOpen
                  ? "scale-100 translate-y-0"
                  : "scale-125 md:scale-150 translate-y-4 md:translate-y-6"
              }`}
            >
              <div
                className={`p-2 transition-all duration-500 ${
                  isScrolled
                    ? "bg-transparent"
                    : "bg-white/85 rounded-xl md:rounded-2xl shadow-2xl border border-orange-200"
                } ${
                  isMenuOpen &&
                    "bg-white/85 rounded-xl md:rounded-2xl shadow-2xl border border-orange-200"
                }`}
              >
                <img
                  src="logo.svg"
                  alt="ODB Estates"
                  className="h-16 md:h-20 w-auto"
                />
              </div>
            </div>
          </div>
          {/* Right Side: Contact/Hamburger */}
          <div className="flex justify-end items-center">
            <a
              href="#contact"
              className={`hidden md:block font-medium text-s uppercase tracking-widest transition-colors duration-500 ${
                isScrolled ? "text-slate-600" : "text-white"
              }`}
            >
              Get In Touch
            </a>

            {/* Hamburger (Mobile) - Color shifts with scroll */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                // If scrolled OR menu is open, use dark icon; otherwise use white icon
                isScrolled || isMenuOpen ? "text-slate-900" : "text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown - Solid background so it covers the hero image */}
        <div
          className={`${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } md:hidden overflow-hidden transition-all duration-500 bg-white shadow-xl rounded-2xl mt-2 md:mt-0 `}
        >
          <div className="flex flex-col py-8 space-y-6 text-center font-bold text-slate-800 uppercase tracking-widest text-sm ">
            <a href="#about" onClick={() => setIsMenuOpen(false)}>
              About Us
            </a>
            <a href="#portfolio" onClick={() => setIsMenuOpen(false)}>
              Portfolio
            </a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-175 pt-32 sm:pt-20 flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Real Estate"
            className="w-full h-full object-cover"
          />
          {/* This gradient makes the text "pop" regardless of the image brightness */}
          <div className="absolute inset-0 bg-linear-to-r from-orange-300/80 to-slate-900/60 shadow-inner"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="text-orange-200 text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
            Established Property Specialists
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Strategic Property <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-200 to-white">
              Portfolio Management
            </span>
          </h2>
          <p className="text-blue-50 max-w-2xl mx-auto text-lg md:text-xl mb-8 font-light">
            Expertly navigating the UK property market through high-yield
            acquisitions, bespoke rentals, and professional development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#portfolio"
              className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg"
            >
              View Portfolio
            </a>
            <button className="border-2 border-white/30 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
              Investment Opportunities
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="relative z-20 -mt-10 max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 text-center hover:bg-slate-50 transition-colors group"
            >
              {/* REPLACED THIS LINE BELOW */}
              <p className="text-3xl font-black text-blue-900 mb-1">
                <RollingNumber value={stat.value} />
              </p>

              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-900 transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Property Grid */}
      <main id="portfolio" className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((item, index) => (
            <motion.div
              key={item.id}
              // 1. Initial state (hidden and slightly down)
              initial={{ opacity: 0, y: 50 }}
              // 2. Animate to this state when in view
              whileInView={{ opacity: 1, y: 0 }}
              // 3. Only animate once
              viewport={{ once: true, margin: "-50px" }}
              // 4. Staggered transition based on index
              transition={{
                duration: 0.6,
                delay: index * 0.1, // Each card waits 0.1s longer than the last
                ease: "easeOut",
              }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
            >
              {/* ... keep all your existing card content inside here (Image, Title, Price, Button) ... */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-blue-900 shadow-sm">
                  {item.status}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  {item.location}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <p className="text-2xl font-black text-blue-900">
                    {item.price}
                  </p>
                  <button
                    onClick={() => openModal(item)}
                    className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors shadow-lg shadow-slate-900/10"
                  >
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Side: Professional Image */}
           
              <div className="w-full lg:w-1/2 relative">
              <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-50 rounded-full z-0"></div>
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  <img
                    src="images/partners.jpg"
                    alt="ODB Estates Founders"
                    className="w-full h-auto object-cover aspect-4/5 md:aspect-auto hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-slate-100 rounded-2xl -z-10"></div>
                </motion.div>
              </div>
            

            {/* Right Side: Your Story */}

            <div className="w-full lg:w-1/2">
              <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
                Behind ODB Estates
              </span>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                Experienced Partners in <br /> Property Investment
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  At ODB Estates, we don't just trade properties; we build
                  value. Founded on the principles of transparency and strategic
                  growth, our partnership combines market expertise with a
                  hands-on approach to every acquisition.
                </p>
                <p>
                  Whether we are renovating a distressed asset for a quick flip
                  or managing a high-yield rental portfolio, our goal is to
                  ensure stability and maximum returns for our stakeholders. We
                  believe in the power of the UK property market to create
                  lasting wealth when managed with precision.
                </p>
              </div>

              {/* Signature/Names Area */}
              <div className="mt-10 pt-10 border-t border-slate-100 flex items-center gap-4">
                <div className="h-12 w-1 bg-blue-900"></div>
                <div>
                  <p className="font-bold text-slate-900 text-xl">
                    Oliver & Numan
                  </p>
                  <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">
                    Founding Partners
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Submission Section */}
      <section id="contact" className="bg-slate-900 py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          {/* Left Side: Call to Action */}
          <div className="bg-blue-900 p-10 md:w-1/3 text-white">
            <h3 className="text-2xl font-bold mb-4">Have a Property?</h3>
            <p className="text-blue-100 mb-6 text-sm leading-relaxed">
              We are always looking for new acquisitions. Whether it's a
              distressed sale, a rental portfolio, or a development project, we
              provide quick decisions.
            </p>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-blue-200">
              <li>✓ Fast Completions</li>
              <li>✓ No Hidden Fees</li>
              <li>✓ Any Condition</li>
            </ul>
          </div>

          {/* Right Side: The Form */}
          <div className="p-10 md:w-2/3">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Property Address
                </label>
                <input
                  type="text"
                  placeholder="Street, City, Postcode"
                  className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Property Details
                </label>
                <textarea
                  rows="4"
                  placeholder="Brief description (Beds, condition, asking price...)"
                  className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-900 outline-none transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white font-black uppercase tracking-widest py-4 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
              >
                Submit Deal for Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center text-sm">
        <p>© 2026 ODB Estates. All rights reserved.</p>
      </footer>

      {selectedProperty && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-blue-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-slate-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Left: Image Section */}
            <div className="md:w-1/2 h-64 md:h-auto">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Detailed Info */}
            <div className="p-8 md:w-1/2">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
                {selectedProperty.status} • {selectedProperty.type}
              </span>
              <h2 className="text-3xl font-black mt-2 mb-4">
                {selectedProperty.title}
              </h2>
              <p className="text-2xl font-bold text-slate-900 mb-6">
                {selectedProperty.price}
              </p>

              <div className="space-y-4 text-slate-600 mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Location:</span>{" "}
                  {selectedProperty.location}
                </div>
                <div className="flex gap-6 py-4 border-y border-slate-100">
                  <div>
                    <span className="block font-black text-slate-900 text-lg">
                      {selectedProperty.beds}
                    </span>{" "}
                    Beds
                  </div>
                  <div>
                    <span className="block font-black text-slate-900 text-lg">
                      {selectedProperty.baths}
                    </span>{" "}
                    Baths
                  </div>
                </div>
                <p className="leading-relaxed">
                  Bespoke property investment opportunity managed by ODB
                  Estates. High-spec finish throughout with excellent potential
                  for long-term growth or immediate rental yield.
                </p>
              </div>

              <a
                href="#contact"
                onClick={closeModal}
                className="block text-center bg-blue-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-blue-900/20"
              >
                Inquire About This Property
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-60 bg-blue-900 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        } hover:bg-slate-800 hover:-translate-y-1`}
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}

export default App;
