import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1F4B43", "#2E7D6E"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
        <p className="text-[#1F4B43] text-sm font-semibold">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const PieChartComponent = ({ title }) => {
  const chartData = [
    { name: "On Offer", value: 3 },
    { name: "Regular", value: 25 },
  ];
  const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full h-96 transition-all duration-300 hover:shadow-2xl">
      <h3 className="text-[#1F4B43] text-xl font-bold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60} // Corrected: larger inner radius for doughnut
            outerRadius={100} // Larger outer radius for bigger doughnut
            fill="#1F4B43"
            animationDuration={800}
            animationEasing="ease-in-out"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[#1F4B43] text-lg font-semibold"
            >
              {totalValue}
            </text>
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={10}
            wrapperStyle={{
              fontSize: "14px",
              color: "#1F4B43",
              paddingTop: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;