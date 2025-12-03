import React, { useState, useMemo, useEffect } from "react";
import { FaHome, FaBuilding, FaDollarSign, FaTag } from "react-icons/fa";
import Tile from "./Tiles.jsx";
import TileGraph from "./TileGraph";
import PieChartComponent from "./PieChartComponent.jsx";
import PropertyCard from "./PropertyCards.jsx";
import RecentActivity from "./RecentActivity.jsx";
import {
  getDashboardData,
  getMonthlyStats,
} from "../../Service/dashboard.service.js";
import { getRecentListings } from "../../Service/list.service.js";

const BACKEND_URL = "http://localhost:3000";

const Combineddashboard = () => {
  // Static listings data

  const tabsData = ["All", "Rent", "Sale"];
  const [selectedTab, setSelectedTab] = useState("All");
  const [dashboardData, setDashboardData] = useState({
    totalProperties: 0,
    totalSellingProperties: 0,
    totalRentingProperties: 0,
    offerListings: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const response = await getMonthlyStats();
        console.log("montly state>>>>>", response.data);
        setMonthlyStats(response.data);
      } catch (error) {
        console.error("Error fetching monthly stats:", error);
      }
    };
    fetchMonthlyStats();
  }, []);

  const {
    totalProperties,
    totalSellingProperties,
    totalRentingProperties,
    offerListings,
  } = dashboardData;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await getRecentListings();
        console.log("response><><><<>", response.data);
        setRecentListings(response.data || []);
      } catch (err) {
        console.error("Error fetching recent listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredProperties = useMemo(() => {
    if (selectedTab === "All") {
      return recentListings;
    }
    return recentListings.filter(
      (property) =>
        property.type.toLowerCase() === selectedTab.toLocaleLowerCase()
    );
  }, [selectedTab, recentListings]);

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
  const graphData = useMemo(() => {
    if (!monthlyStats || monthlyStats.length === 0) return [];

    return monthlyStats.map((stat) => ({
      name: stat.month,
      total: stat.total,
      sale: stat.sale,
      rent: stat.rent,
      offer: stat.offer,
    }));
  }, [monthlyStats]);

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
            title="Monthly Property Trends"
            dataKey={selectedTile} // use dynamic key: total, sale, rent, offer
            data={graphData}
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
          <h2 className="text-2xl font-extrabold mb-3 text-[#1F4B43] tracking-tight text-center">
            View Recently Added Properties
          </h2>
          <div className="flex justify-center space-x-4 mb-6">
            {tabsData.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200  cursor-pointer ${
                  selectedTab === tab
                    ? "bg-[#1F4B43] text-white shadow-md scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <RecentActivity key={property._id} property={property} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No properties found for the selected category.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Property Cards Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-[#1F4B43] border-b pb-2">
          Featured Property Listings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentListings.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Combineddashboard;
