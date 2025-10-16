// components/Tile.jsx
import React from "react";

const Tile = ({ title, value, icon, bgColor, textColor, onClick }) => {
  const finalBgColor = bgColor || 'bg-white';
  const finalTextColor = textColor || 'text-gray-800';

  return (
    <div
      className={`
        flex items-center justify-between p-5 rounded-2xl shadow-xl 
        ${finalBgColor} ${finalTextColor} 
        transition-all duration-300 transform hover:scale-[1.03] cursor-pointer
        hover:shadow-2xl
      `}
      onClick={onClick}
      role="button" // Accessibility: indicates the element is a clickable button
      tabIndex={0}  // Accessibility: makes the element focusable
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick && onClick();
        }
      }}
    >
      {/* Content Section */}
      <div className="flex flex-col">
        {/* Title: Uppercase and slightly faded */}
        <p className={`text-sm font-medium opacity-80 uppercase tracking-wider ${finalTextColor === 'text-white' ? 'text-gray-200' : 'text-gray-500'}`}>
          {title}
        </p>
        {/* Value: Larger, bolder, and localized number formatting */}
        <p className="text-3xl sm:text-4xl font-extrabold mt-1">
          {value.toLocaleString()}
        </p>
      </div>
      
      {/* Icon Section: Large and faded */}
      <div className="text-4xl opacity-70">
        {icon}
      </div>
    </div>
  );
};

export default Tile;