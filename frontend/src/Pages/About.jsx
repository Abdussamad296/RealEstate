import React, { useState } from 'react';
import { FaRegHandshake, FaBullseye, FaChartLine } from 'react-icons/fa6'; 
import Footer from './homepage/Footer'; 
import PerfectHome from './homepage/PerfectHome'; 

const About = () => {


    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const PRIMARY_DARK_GREEN = "#1F4B43";
    const ACCENT_YELLOW = "text-yellow-400";
    const PRIMARY_DARK_TEXT = "text-gray-900";

    // Agent data for cleaner rendering
    const agents = [
        { name: "John Doe", title: "Senior Agent", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=300&h=300&q=80" },
        { name: "Jane Smith", title: "Luxury Specialist", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=300&h=300&q=80" },
        { name: "Michael Lee", title: "Buyer's Representative", img: "https://images.unsplash.com/photo-1507003211169-0a8169c7aa6d?fit=crop&w=300&h=300&q=80" },
        { name: "Sarah Chen", title: "Listing Expert", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=300&h=300&q=80" },
        { name: "Alex Velez", title: "Commercial Lead", img: "https://images.unsplash.com/photo-1608219039016-16e50722370f?fit=crop&w=300&h=300&q=80" },
        { name: "Mia Johnson", title: "Rental Advisor", img: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?fit=crop&w=300&h=300&q=80" },
    ];

    const openAgentProfile = (agent) => {
        setProfileModalOpen(true);
        setSelectedAgent(agent);
    }

    const closeAgentProfile = () => {
        setProfileModalOpen(false);
        setSelectedAgent(null);
    }

    return (
        <div>
            {/* --- 1. Hero Section: Full Screen Banner --- */}
            
            <section className="relative h-screen flex items-center justify-center">
                {/* Background Image with Overlay */}
                <img 
                    src="https://www.technocrazed.com/wp-content/uploads/2015/12/Home-Wallpaper-32.jpg" 
                    alt="Modern house exterior with sunset light" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-black/60"></div> 
                
                {/* Content Container */}
                <div className="relative max-w-4xl mx-auto text-center text-white p-6 z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                        We are <span className={ACCENT_YELLOW}>Skyline</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">
                        Your dedicated partner in navigating the future of real estate.
                    </p>
                    
                    {/* Concise Mission Paragraph */}
                    <p className="text-base font-medium">
                        Our mission is simple: to provide a **seamless, confident experience** for every buyer, seller, and renter. We combine a vast selection of verified properties with expert, personalized guidance to ensure your journey is successful and enjoyable.
                    </p>
                </div>
            </section>

            {/* --- 2. Mission, Vision, and Values Section --- */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-gray-900">
                            Our Commitment
                        </h2>
                        <p className="mt-3 text-xl text-gray-600">
                            Driven by trust, transparency, and technology.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Value Card 1: Trust */}
                        <div className="text-center p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <FaRegHandshake className={`w-10 h-10 mx-auto mb-4 ${ACCENT_YELLOW}`} />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Trust & Transparency</h3>
                            <p className="text-gray-600 text-sm">
                                We believe in honest dealings and clear communication, making the complexities of property transactions simple and open for everyone.
                            </p>
                        </div>

                        {/* Value Card 2: Vision */}
                        <div className="text-center p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <FaBullseye className={`w-10 h-10 mx-auto mb-4 ${ACCENT_YELLOW}`} />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Focused Expertise</h3>
                            <p className="text-gray-600 text-sm">
                                Our agents are market specialists, providing targeted insights and advice to help you achieve your specific property goals.
                            </p>
                        </div>

                        {/* Value Card 3: Growth */}
                        <div className="text-center p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <FaChartLine className={`w-10 h-10 mx-auto mb-4 ${ACCENT_YELLOW}`} />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Innovative Tools</h3>
                            <p className="text-gray-600 text-sm">
                                Utilizing cutting-edge technology, we streamline searching, listing, and closing, saving you time and effort.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Component to be placed here */}
            <PerfectHome/> 

            {/* --- 3. Meet Our Agents Section (UPDATED) --- */}
            <section className="py-20 bg-gray-50"> {/* Changed to light gray for distinction from white */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className={`text-4xl font-extrabold ${PRIMARY_DARK_TEXT}`}>
                            Meet Our Agents
                        </h2>
                        <p className="mt-3 text-xl text-gray-600">
                            Our team of experienced real estate professionals is here to guide you every step of the way.
                        </p>
                    </div>

                    {/* Agent Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                        {agents.map((agent, index) => (
                            <div 
                                key={index} 
                                className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:scale-[1.02]"
                            >
                                <img 
                                    src={agent.img} 
                                    alt={`${agent.name}'s profile picture`} 
                                    className="w-24 h-24 object-cover rounded-full mb-3 border-4 border-white shadow-inner ring-2 ring-yellow-400"
                                    onClick={() => openAgentProfile(agent)}
                                />
                                <h3 className={`text-lg font-bold ${PRIMARY_DARK_TEXT}`}>{agent.name}</h3>
                                <p className="text-sm text-gray-500 font-medium">{agent.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {profileModalOpen && selectedAgent && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-70 backdrop-blur-xs"
                    onClick={closeAgentProfile} // Close modal when clicking outside
                >
                    <div 
                        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-11/12 mx-auto relative transform transition-all duration-300 scale-100 opacity-100"
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeAgentProfile}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-semibold"
                            aria-label="Close profile"
                        >
                            &times;
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <img 
                                src={selectedAgent.img} 
                                alt={`${selectedAgent.name}'s profile`} 
                                className="w-32 h-32 object-cover rounded-full mb-6 border-4 border-white shadow-lg ring-4 ring-yellow-500"
                            />
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                {selectedAgent.name}
                            </h3>
                            <p className="text-xl text-gray-600 font-semibold mb-4">
                                {selectedAgent.title}
                            </p>
                            
                            {/* Dummy description for the agent */}
                            <p className="text-gray-700 leading-relaxed mb-6">
                                {selectedAgent.name} is a dedicated and highly experienced {selectedAgent.title.toLowerCase()} with a passion for helping clients achieve their real estate dreams. With a proven track record in [mention a specific area or skill, e.g., "luxury properties" or "first-time home buyers"], {selectedAgent.name} is committed to providing exceptional service and expert market insights.
                            </p>

                            {/* Contact buttons (example) */}
                            <div className="flex gap-4 mt-4">
                                <a 
                                    href={`mailto:contact@${selectedAgent.name.toLowerCase().replace(/\s/g, '')}.com`}
                                    className="bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-600 transition duration-300 shadow-md"
                                >
                                    Email {selectedAgent.name.split(' ')[0]}
                                </a>
                                <button
                                    onClick={() => alert(`Calling ${selectedAgent.name}...`)}
                                    className="bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-full hover:bg-gray-300 transition duration-300 shadow-md"
                                >
                                    Call Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer/>
        </div>
    );
}

export default About;