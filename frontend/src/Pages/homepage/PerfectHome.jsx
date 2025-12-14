import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  FaMagnifyingGlass,
  FaRegHandshake,
  FaHouseChimney,
} from "react-icons/fa6";
import leftImage from "../../assets/h21.jpg.png";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import toast from "react-hot-toast";
import { getAllUsers } from "../../Service/user.service";

// Static step data
const howItWorksSteps = [
  {
    id: 1,
    icon: FaMagnifyingGlass,
    title: "Search & Discover",
    description:
      "Use our smart filters to find properties that match your lifestyle, location, and budget.",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    icon: FaRegHandshake,
    title: "Connect With Agents",
    description:
      "Reach out directly to trusted agents to schedule viewings and get expert assistance.",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    icon: FaHouseChimney,
    title: "Move Into Your Dream Home",
    description:
      "Finalize the deal with confidence and move into your perfect new home hassle-free.",
    iconBg: "bg-yellow-100 text-yellow-600",
  },
];

// Memoized Step Card
const StepCard = memo(
  ({ icon: Icon, title, description, iconBg, delay, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`p-3 rounded-full flex-shrink-0 w-10 h-10 flex items-center justify-center ${iconBg}`}
        aria-label={title}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
);

const PerfectHome = ({ searchRef, featuredRef }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    action: "",
  });
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState({});

  const validation = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
      action: validateField("action", formData.action),
      selectedAgent: selectedAgent ? "" : "Please select an agent",
    };

    setError(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 3)
          return "Name must be at least 3 characters";
        return "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Invalid email format";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        return "";
      case "action":
        if (!value.trim()) return "Action is required";
        return "";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await getAllUsers();;
        setAgents(res.data || []);
      } catch (err) {
        console.error("Failed to load agents:", err);
      }
    };
    fetchAgents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateField(name, value);
    setError((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Handle step click
  const handleStepClick = (title) => {
    if (title === "Search & Discover" && searchRef?.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (title === "Connect With Agents") {
      setIsModalOpen(true);
    } else if (title === "Move Into Your Dream Home" && featuredRef?.current) {
      featuredRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation()) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      action: formData.action,
      agentId: selectedAgent,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/booking/create-booking",
        payload
      );
      toast.success("Request sent successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", message: "", action: "" });
      setSelectedAgent("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleAgentChange = (e) => {
    const value = e.target.value;
    setSelectedAgent(value);
    setError((prev) => ({
      ...prev,
      selectedAgent: value ? "" : "Please select an agent",
    }));
  };

  return (
    <section className="bg-white py-12" aria-labelledby="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* LEFT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <LazyLoadImage
              src={leftImage}
              alt="Person browsing real estate app"
              effect="blur"
              className="rounded-xl w-[80%] h-auto object-cover shadow-xl"
            />
          </motion.div>

          {/* RIGHT CONTENT */}
          <div className="w-full lg:w-1/2">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2"
            >
              How It Works
            </motion.p>

            <motion.h2
              id="how-it-works-section"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-bold text-gray-900 leading-tight mb-3"
            >
              Find Your Perfect Home in 3 Easy Steps
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-gray-600 mb-4 max-w-md"
            >
              Discover how simple it is to find, connect, and move into your
              dream property with our platform.
            </motion.p>

            {/* Steps */}
            <div>
              {howItWorksSteps.map((step, index) => (
                <StepCard
                  key={step.id}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  iconBg={step.iconBg}
                  delay={0.3 + index * 0.2}
                  onClick={() => handleStepClick(step.title)}
                />
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 px-6 py-3 bg-[#1F4B43] text-white rounded-full shadow-md hover:bg-green-950 transition duration-300"
              onClick={() => {
                if (searchRef?.current) {
                  searchRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Start Your Search Today
            </motion.button>
          </div>
        </div>
      </div>

      {/* 🧾 Book a Visit Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4 text-center">
              🏠 Book a Visit
            </Dialog.Title>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  error.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-green-600"
                }`}
              />
              {error.name && (
                <p className="text-red-500 text-xs">{error.name}</p>
              )}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  error.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-green-600"
                }`}
              />
              {error.email && (
                <p className="text-red-500 text-xs">{error.email}</p>
              )}

              <select
                value={selectedAgent}
                onChange={handleAgentChange}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  error.selectedAgent
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-green-600"
                }`}
              >
                <option value="">Select Agent</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.username}
                  </option>
                ))}
              </select>
              {error.selectedAgent && (
                <p className="text-red-500 text-xs">{error.selectedAgent}</p>
              )}
              <select
                name="action"
                value={formData.action}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  error.action
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-green-600"
                }`}
              >
                <option value="">Select Action</option>
                <option value="visit">Visit</option>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
              {error.action && (
                <p className="text-red-500 text-xs">{error.action}</p>
              )}

              <textarea
                name="message"
                rows="3"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md outline-none ${
                  error?.message
                    ? "border-red-500 focus:ring-2 focus:ring-red-600"
                    : "focus:ring-2 focus:ring-green-600"
                }`}
              />
              {error?.message && (
                <p className="text-red-500 text-xs">{error.message}</p>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-[#1F4B43] text-white rounded-md hover:bg-green-950 transition"
              >
                Submit Request
              </button>
            </form>

            <Dialog.Close asChild>
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
};

export default PerfectHome;
