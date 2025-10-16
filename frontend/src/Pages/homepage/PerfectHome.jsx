import React from "react";
// Import icons for the steps
import { FaMagnifyingGlass, FaRegHandshake, FaHouseChimney } from "react-icons/fa6";

// Placeholder for the local image import. Ensure the path is correct in your project.
import leftImage from "../../assets/h21.jpg.png";

// Data for the "How It Works" steps
const howItWorksSteps = [
  {
    id: 1,
    icon: FaMagnifyingGlass,
    title: "Search & Discover",
    description: "Use our powerful filters to find properties matching your exact needs, location, and budget.",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    icon: FaRegHandshake,
    title: "Connect With Agents",
    description: "Reach out directly to trusted agents to schedule viewings and get personalized assistance.",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    icon: FaHouseChimney,
    title: "Move Into Your Dream Home",
    description: "Finalize the deal with confidence and step into your perfect new home.",
    iconBg: "bg-yellow-100 text-yellow-600",
  },
];

// Reusable component for each step
const StepCard = ({ icon: Icon, title, description, iconBg }) => (
  <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition duration-300">
    {/* Icon Container */}
    <div className={`p-3 rounded-full flex-shrink-0 w-10 h-10 flex items-center justify-center ${iconBg}`}>
      <Icon className="w-3 h-3" />
    </div>
    {/* Text Content */}
    <div>
      <h3 className="text-md font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </div>
);

const PerfectHome = () => {
  return (
    // Use max-width container and add vertical padding
    <div className="bg-white p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column: Image */}
          <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-2xl">
            {/* Added max-h-96 and object-cover to ensure the image looks good */}
            <img 
              src={leftImage} 
              alt="Illustration of a person using a property app" 
              className="w-[70%] h-[70%] object-cover" 
              loading="lazy"
            />
          </div>
          
          {/* Right Column: Text and Steps */}
          <div className="w-full lg:w-1/2">
            <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2">
              How It Works
            </p>
            <h2 className="text-xl font-semibold text-gray-900 leading-tight mb-2">
              Find Your Perfect Home in 3 Easy Steps
            </h2>
            <p className="text-sm text-gray-600 mb-2 max-w-lg">
              Pellentesque egestas elementum egestas faucibus sem. Velit nunc
              egestas ut morbi. Leo diam diam.
            </p>

            {/* Steps Container */}
            <div className="">
              {howItWorksSteps.map((step) => (
                <StepCard 
                  key={step.id} 
                  icon={step.icon} 
                  title={step.title} 
                  description={step.description} 
                  iconBg={step.iconBg}
                />
              ))}
            </div>
            
            {/* Optional: Add a button/CTA at the bottom */}
            <button className="mt-8 px-6 py-3 bg-[#1F4B43] text-white rounded-full shadow-md hover:bg-green-950 transition duration-300">
                Start Your Search Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfectHome;