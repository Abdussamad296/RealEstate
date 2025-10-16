import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BAR_COLORS = ["#A3E4D7", "#B2F2BB", "#C6F6D5", "#D3F9D8", "#E6FFED"];
const GRID_COLOR = "#E2E8F0"; // lighter grid
const AXIS_COLOR = "#718096"; // subtle axis color

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value !== undefined ? payload[0].value : 0;
    return (
      <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200 pointer-events-none">
        <p className="text-gray-500 text-xs mb-1">{label}</p>
        <p className="text-[#1F4B43] font-semibold">{`${payload[0].dataKey}: ${value}`}</p>
      </div>
    );
  }
  return null;
};

const TileGraph = ({ title, dataKey, data }) => {
  const getBarColor = (index) => BAR_COLORS[index % BAR_COLORS.length];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full mx-auto mt-6 transform transition hover:scale-[1.01]">
      <h3 className="text-[#1F4B43] text-xl font-bold mb-4 text-center">
        {title} Analysis
      </h3>

      <div style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: AXIS_COLOR }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar
              dataKey={dataKey}
              radius={[10, 10, 0, 0]}
              isAnimationActive={true}
              fill={(entry, index) => getBarColor(index)}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TileGraph;
