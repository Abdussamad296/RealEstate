import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaApple, FaGooglePlay } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa"; 

const Footer = () => {
  const PRIMARY_COLOR = "#1F4B43";
  const TEXT_COLOR = "#E0E0E0"; 
  const LINK_COLOR = "#A0A0A0"; 
  const HIGHLIGHT_COLOR = "#ffffff"; 
  const ICON_SIZE = "w-4 h-4";

  // Data for navigation columns
  const discoverLinks = ["Miami", "New York", "Chicago", "Florida", "Los Angeles", "San Diego"];
  const quickLinks = ["About", "Contact", "FAQ's", "Blog", "Pricing Plans", "Privacy Policy", "Terms & Conditions"];

  // Helper function to handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className={`bg-[${PRIMARY_COLOR}] text-[${TEXT_COLOR}] pt-12 pb-6 relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Top Section: Logo, Follow Us, and Main Columns --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-10 border-b border-gray-700/50">
          
          {/* 1. Logo Column & Follow Us (Stacked at top right on the screenshot) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col justify-start">
            <div className="flex items-center text-3xl font-bold text-[${HIGHLIGHT_COLOR}] mb-10">
              {/* Placeholder for "JustHome" logo/icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0h-2a1 1 0 00-1 1v1h10v-1a1 1 0 00-1-1h-2M9 20h6" />
              </svg>
              <span className="text-2xl font-extrabold tracking-wide">SkyLine</span>
            </div>
            {/* The "FOLLOW US" and icons are placed here to match the visual location */}
            <div className="hidden lg:block absolute top-30 right-12">
                <p className={`text-xs text-[${LINK_COLOR}] tracking-widest  transform origin-right whitespace-nowrap mb-6`}>FOLLOW US</p>
                <div className="flex gap-4 rotate-90 transform origin-bottom-right">
                    <a href="#" aria-label="Facebook"><FaFacebookF className={ICON_SIZE} /></a>
                    <a href="#" aria-label="Twitter"><FaTwitter className={ICON_SIZE} /></a>
                    <a href="#" aria-label="LinkedIn"><FaLinkedinIn className={ICON_SIZE} /></a>
                    <a href="#" aria-label="Instagram"><FaInstagram className={ICON_SIZE} /></a>
                </div>
            </div>
          </div>


          {/* 2. Subscribe Column (Full width on small screens) */}
          <div className="col-span-2 lg:col-span-1 order-3 lg:order-2 mt-4 lg:mt-0">
            <h4 className={`text-lg font-bold text-[${HIGHLIGHT_COLOR}] mb-4`}>Subscribe</h4>
            <div className="flex bg-gray-700/50 rounded-lg overflow-hidden w-full max-w-xs">
              <input
                type="email"
                placeholder="Your e-mail"
                className="flex-grow bg-transparent text-sm py-2 px-3 placeholder-gray-400 focus:outline-none"
                aria-label="Email subscription field"
              />
              <button className="bg-gray-600/50 hover:bg-gray-500/50 transition duration-200 text-sm font-semibold py-2 px-4 rounded-r-lg flex-shrink-0">
                Send →
              </button>
            </div>
            <p className={`text-xs mt-3 text-[${LINK_COLOR}] max-w-[200px]`}>
              Subscribe to our newsletter to receive our weekly feed.
            </p>
          </div>

          {/* 3. Discover Column */}
          <div className="order-4 lg:order-3">
            <h4 className={`text-lg font-bold text-[${HIGHLIGHT_COLOR}] mb-4`}>Discover</h4>
            <ul className={`space-y-2 text-sm text-[${LINK_COLOR}]`}>
              {discoverLinks.map(link => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition duration-200">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Quick Links Column */}
          <div className="order-5 lg:order-4">
            <h4 className={`text-lg font-bold text-[${HIGHLIGHT_COLOR}] mb-4`}>Quick Links</h4>
            <ul className={`space-y-2 text-sm text-[${LINK_COLOR}]`}>
              {quickLinks.map(link => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition duration-200">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Contact Us / Our Address Columns (Merged for better mobile/tablet layout) */}
          <div className="order-6 lg:order-5 space-y-8">
            <div className="max-w-[150px]">
              <h4 className={`text-lg font-bold text-[${HIGHLIGHT_COLOR}] mb-4`}>Contact Us</h4>
              <p className={`text-sm text-[${LINK_COLOR}]`}>
                <a href="mailto:hi@skiline.com" className="hover:text-white transition">hi@skiline.com</a>
              </p>
              <p className={`text-sm text-[${LINK_COLOR}]`}>(123) 456-7890</p>
            </div>
            <div>
              <h4 className={`text-lg font-bold text-[${HIGHLIGHT_COLOR}] mb-4`}>Our Address</h4>
              <p className={`text-sm text-[${LINK_COLOR}]`}>
                99 Fifth Avenue, 3rd Floor
                <br />
                San Francisco, CA 1980
              </p>
            </div>
          </div>
{/*           
          <div className="col-span-2 lg:col-span-1 order-2 lg:order-6">
            <h4 className={`text-lg font-bold text-[${HIGHLIGHT_COLOR}] mb-4`}>Get the app</h4>
            <div className="space-y-3">
              <a 
                href="#"
                className="flex items-center justify-center py-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition duration-200 w-full max-w-[170px]"
              >
                <FaApple className="w-5 h-5 mr-2" />
                <div className="flex flex-col items-start text-xs leading-none">
                    <span className="text-[10px] text-gray-400">Download on the</span>
                    <span className="font-semibold text-[${HIGHLIGHT_COLOR}]">Apple Store</span>
                </div>
              </a>
              <a 
                href="#"
                className="flex items-center justify-center py-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition duration-200 w-full max-w-[170px]"
              >
                <FaGooglePlay className="w-5 h-5 mr-2" />
                <div className="flex flex-col items-start text-xs leading-none">
                    <span className="text-[10px] text-gray-400">Get it on</span>
                    <span className="font-semibold text-[${HIGHLIGHT_COLOR}]">Google Play</span>
                </div>
              </a>
            </div>
          </div> */}

        </div>

        {/* --- Bottom Section: Copyright and Scroll Button --- */}
        <div className="flex justify-center items-center pt-6 text-sm">
          <p className={`text-[${LINK_COLOR}]`}>
            Copyright © 2025. SkyLine
          </p>
          
          {/* Scroll to Top Button */}
          <button 
            onClick={scrollToTop} 
            className="absolute bottom-6 right-6 p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition duration-300 shadow-lg"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;