// components/MultiLevelDropdown.js
import React, { useState, useRef, useEffect } from 'react';

const MultiLevelDropdown = ({ onSelectNeighborhood, neighborhoodsByBorough }) => {
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMainDropdownOpen(false);
        setOpenSubmenus({});
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSubmenu = (borough, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    setOpenSubmenus(prev => ({
      ...prev,
      [borough]: !prev[borough]
    }));
  };

  const handleNeighborhoodSelect = (borough, neighborhood, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    onSelectNeighborhood(borough, neighborhood);
    setIsMainDropdownOpen(false);
    setOpenSubmenus({});
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="w-full p-2 bg-white border border-gray-300 rounded flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsMainDropdownOpen(!isMainDropdownOpen)}
      >
        <span>Select Location</span>
        <span className="ml-2">▼</span>
      </button>
      
      {isMainDropdownOpen && (
        <ul className="absolute z-10 w-48 py-1 mt-1 bg-white border border-gray-300 rounded shadow-lg">
          {Object.keys(neighborhoodsByBorough).map((borough) => (
            <li key={borough} className="relative px-4 py-2 hover:bg-gray-100">
              <a 
                href="#" 
                className="flex justify-between items-center w-full"
                onClick={(e) => toggleSubmenu(borough, e)}
              >
                <span>{borough}</span>
                <span className="ml-2">▶</span>
              </a>
              
              {openSubmenus[borough] && (
                <ul className="absolute z-10 left-full top-0 w-48 py-1 mt-0 bg-white border border-gray-300 rounded shadow-lg">
                  {Object.keys(neighborhoodsByBorough[borough]).map((neighborhood) => (
                    <li 
                      key={neighborhood} 
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      <a 
                        href="#" 
                        onClick={(e) => handleNeighborhoodSelect(borough, neighborhood, e)}
                      >
                        {neighborhood}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiLevelDropdown;