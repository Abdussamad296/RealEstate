import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import Footer from './homepage/Footer';

const ContactUs = () => {
    // State to handle form input (optional, but good practice)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    // Define brand colors for consistency
    const PRIMARY_DARK_GREEN = "#1F4B43";
    const ACCENT_YELLOW = "text-yellow-400";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to an API endpoint
        console.log("Form submitted:", formData);
        alert("Thank you for your message! We will get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div>
            {/* --- 1. Hero Section: Contact Header --- */}
            <section className="relative h-screen flex items-center justify-center">
                <img 
                    // Using a high-quality, generic office image
                    src="https://www.itl.cat/pngfile/big/8-88141_47434776-room-wallpaper-wood-decor-living-room.jpg" 
                    alt="Modern office or reception area" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div> 
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-2">
                        Get In Touch
                    </h1>
                    <p className="text-lg md:text-xl font-light">
                        We're here to answer your questions and help you find your new home.
                    </p>
                </div>
            </section>

            {/* --- 2. Main Content: Form and Info --- */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12">
                        
                        {/* Left Column: Contact Form */}
                        <div className="lg:w-2/3 bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                                Send Us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                </div>
                                
                                {/* Subject Field */}
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                />

                                {/* Message Field */}
                                <textarea
                                    name="message"
                                    placeholder="Your Message..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                                />

                                {/* Submit Button with Yellow Accent */}
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-yellow-500 text-gray-900 font-bold text-lg rounded-lg hover:bg-yellow-600 transition duration-300 shadow-md"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                        
                        {/* Right Column: Contact Information (Dark Green) */}
                        <div 
                            className="lg:w-1/3 p-8 rounded-xl shadow-lg text-white"
                            style={{ backgroundColor: PRIMARY_DARK_GREEN }}
                        >
                            <h2 className="text-3xl font-bold mb-6 border-b border-white/30 pb-3">
                                Contact Info
                            </h2>
                            
                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className={`w-5 h-5 mt-1 flex-shrink-0 ${ACCENT_YELLOW}`} />
                                    <div>
                                        <p className="font-semibold text-lg">Our Location</p>
                                        <p className="text-gray-300">
                                            99 Fifth Avenue, 3rd Floor, <br />
                                            San Francisco, CA 1980
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <FaPhoneAlt className={`w-5 h-5 mt-1 flex-shrink-0 ${ACCENT_YELLOW}`} />
                                    <div>
                                        <p className="font-semibold text-lg">Call Us</p>
                                        <p className="text-gray-300">(123) 456-7890</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <FaEnvelope className={`w-5 h-5 mt-1 flex-shrink-0 ${ACCENT_YELLOW}`} />
                                    <div>
                                        <p className="font-semibold text-lg">Email Us</p>
                                        <p className="text-gray-300">hi@skyline.com</p>
                                    </div>
                                </div>
                                
                                {/* Hours (Optional but helpful) */}
                                <div className="flex items-start gap-4">
                                    <FaClock className={`w-5 h-5 mt-1 flex-shrink-0 ${ACCENT_YELLOW}`} />
                                    <div>
                                        <p className="font-semibold text-lg">Working Hours</p>
                                        <p className="text-gray-300">Mon - Fri: 9:00 AM - 5:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
}

export default ContactUs;