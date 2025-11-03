import React, { useState, useMemo, useEffect } from "react";
import { FaHome, FaBuilding, FaDollarSign, FaTag } from "react-icons/fa";
import Tile from "./Tiles.jsx";
import TileGraph from "./TileGraph";
import PieChartComponent from "./PieChartComponent.jsx";
import PropertyCard from "./PropertyCards.jsx";
import RecentActivity from "./RecentActivity.jsx";
import { getDashboardData } from "../../Service/dashboard.service.js";
const Combineddashboard = () => {
  // Static listings data

  const tabsData = ["All", "Rent", "Sale"];

  const listings = [
    { type: "rent", offer: true },
    { type: "sale", offer: false },
    { type: "rent", offer: false },
    { type: "sale", offer: true },
    { type: "sale", offer: true },
    { type: "rent", offer: true },
    { type: "sale", offer: false },
  ];

  const [dashboardData, setDashboardData] = useState({
    totalProperties: 0,
    totalSellingProperties: 0,
    totalRentingProperties: 0,
    offerListings: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        setDashboardData(response);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const {
    totalProperties,
    totalSellingProperties,
    totalRentingProperties,
    offerListings,
  } = dashboardData;

  // Dummy data for property cards
  const propertyData = [
    {
      _id: { $oid: "68cd585127a987f069c05d5d" },
      name: "Sunny 2-Bedroom Condo",
      address: "123 Urban Blvd, Metropolis, CA 90210",
      price: 20000,
      bedrooms: 2,
      bathrooms: 2,
      type: "rent",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    },
    {
      _id: { $oid: "68cd585127a987f069c05d5e" },
      name: "Cozy 3-Bedroom House with Large Yard",
      address: "456 Rural Rd, Suburbia, CA 90211",
      price: 350000,
      bedrooms: 3,
      bathrooms: 2,
      type: "sale",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    },
    {
      _id: { $oid: "68cd585127a987f069c05d5f" },
      name: "Modern 1-Bedroom Apartment near Transit",
      address: "789 City Ave, Downtown, CA 90212",
      price: 1500,
      bedrooms: 1,
      bathrooms: 1,
      type: "rent",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    },
    {
      _id: { $oid: "68cd585127a987f069c05d5d" },
      name: "Sunny 2-Bedroom Condo",
      address: "123 Urban Blvd, Metropolis, CA 90210",
      price: 20000,
      bedrooms: 2,
      bathrooms: 2,
      type: "rent",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    },
    {
      _id: { $oid: "68cd585127a987f069c05d5e" },
      name: "Cozy 3-Bedroom House with Large Yard",
      address: "456 Rural Rd, Suburbia, CA 90211",
      price: 350000,
      bedrooms: 3,
      bathrooms: 2,
      type: "sale",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    },
  ];

  const [selectedTile, setSelectedTile] = useState("total");

  // Tile configuration with distinct colors
  const tiles = useMemo(
    () => [
      {
        id: "total",
        title: "Total Properties",
        value: totalProperties,
        icon: <FaHome />,
        bgColor: "bg-[#1F4B43]", // Deep Teal
        textColor: "text-white",
      },
      {
        id: "sale",
        title: "Properties For Sale",
        value: totalSellingProperties,
        icon: <FaBuilding />,
        bgColor: "bg-[#2ECC71]", // Green
        textColor: "text-white",
      },
      {
        id: "rent",
        title: "Properties For Rent",
        value: totalRentingProperties,
        icon: <FaDollarSign />,
        bgColor: "bg-[#3498DB]", // Blue
        textColor: "text-white",
      },
      {
        id: "offer",
        title: "Listings on Offer",
        value: offerListings,
        icon: <FaTag />,
        bgColor: "bg-[#E67E22]", // Orange
        textColor: "text-white",
      },
    ],
    [
      totalProperties,
      totalSellingProperties,
      totalRentingProperties,
      offerListings,
    ]
  );

  // Graph data
  const graphData = useMemo(
    () => ({
      total: [{ name: "Total Properties", value: totalProperties }],
      sale: [{ name: "Properties For Sale", value: totalSellingProperties }],
      rent: [{ name: "Properties For Rent", value: totalRentingProperties }],
      offer: [
        { name: "Listings on Offer", value: offerListings },
        { name: "Regular", value: totalProperties - offerListings },
      ],
    }),
    [
      totalProperties,
      totalSellingProperties,
      totalRentingProperties,
      offerListings,
    ]
  );

  // Pie chart data (using colors that match the tiles for consistency)
  const pieDataType = useMemo(
    () => [
      { name: "For Sale", value: totalSellingProperties, color: "#2ECC71" },
      { name: "For Rent", value: totalRentingProperties, color: "#3498DB" },
    ],
    [totalSellingProperties, totalRentingProperties]
  );

  const pieDataOffer = useMemo(
    () => [
      { name: "On Offer", value: offerListings, color: "#E67E22" },
      {
        name: "Regular",
        value: totalProperties - offerListings,
        color: "#BDC3C7",
      },
    ],
    [offerListings, totalProperties]
  );

  // --- Dynamic Graph Props ---
  const RENT_BAR_COLORS = [
    "#3498DB",
    "#5DADE2",
    "#85C1E9",
    "#AED6F1",
    "#D6EAF8",
    "#2E86C1",
    "#2874A6",
  ];

  const currentBarColors =
    selectedTile === "rent" ? RENT_BAR_COLORS : undefined;

  const graphTitle =
    selectedTile === "rent"
      ? "Properties For Rent"
      : tiles.find((t) => t.id === selectedTile)?.title ||
        "Property Distribution";
  // ---------------------------

  return (
    <div className="p-4 sm:p-6 min-h-screen pt-16 bg-gray-100 mt-10">
      <h1 className="text-3xl font-extrabold mb-10 text-[#1F4B43] text-center">
        Real Estate Dashboard 🏠
      </h1>

      {/* Tiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            onClick={() => setSelectedTile(tile.id)}
            className={`cursor-pointer transform hover:scale-[1.03] transition-transform duration-200 ${
              selectedTile === tile.id
                ? "ring-4 ring-offset-2 ring-[#1F4B43]/50 rounded-xl"
                : ""
            }`}
          >
            <Tile
              title={tile.title}
              value={tile.value}
              icon={tile.icon}
              bgColor={tile.bgColor}
              textColor={tile.textColor}
            />
          </div>
        ))}
      </div>

      {/* Graph Section */}
      {selectedTile && (
        <div className="mt-10">
          <TileGraph
            title={graphTitle}
            dataKey="value"
            data={graphData[selectedTile]}
            barColors={currentBarColors}
          />
        </div>
      )}

      {/* Pie Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <div className="space-y-6">
          <PieChartComponent
            data={pieDataType}
            title="Property Type Distribution"
          />
          <PieChartComponent
            data={pieDataOffer}
            title="Listings on Offer vs Regular"
          />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full h-full">
          <h2 className="text-2xl font-extrabold mb-6 text-[#1F4B43] tracking-tight text-center">
            View Recently Added Properties
          </h2>
          {tabsData.map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer"
              // onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
          <div className="space-y-4">
            {propertyData.map((property) => (
              <RecentActivity key={property._id.$oid} property={property} />
            ))}
          </div>
        </div>
      </div>

      {/* Property Cards Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-[#1F4B43] border-b pb-2">
          Featured Property Listings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyData.map((property) => (
            <PropertyCard key={property._id.$oid} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Combineddashboard;
