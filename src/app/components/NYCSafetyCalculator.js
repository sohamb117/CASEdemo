// components/NYCSafetyCalculator.js

"use client";

import React, { useState } from 'react';
import MultiLevelDropdown from './MultiLevelDropdown';

const NYCSafetyCalculator = () => {
  // NYC traffic constants (2024 data)
  const nyc_fatalities = 247;          // Total annual traffic deaths
  const nyc_vmt = 20_000_000_000;      // 20 billion annual vehicle miles
  const base_fatality_rate = nyc_fatalities / nyc_vmt;
  
  // Distance database (miles to SoHo) organized by borough
  const neighborhoodsByBorough = {
    "Manhattan": {
      "Chelsea": 1,
      "Tribeca": 1,
      "East Village": 1,
      "Upper East Side": 5.0,
      "Upper West Side": 4.0,
      "Harlem": 9.0,
      "Washington Heights": 8.5,
      "Inwood": 9.5,
      "Midtown": 1.0,
      "Financial District": 0.73,
      "Lower East Side": 0.8,
      "Hudson Yards": 3.0,
      "Times Square": 1.0,
      "Chinatown": 1,
      "West Village": 1
    },
    "Brooklyn": {
      "Williamsburg": 2.0,
      "Bushwick": 3.0,
      "Park Slope": 2.0,
      "Brooklyn Heights": 2.0,
      "Coney Island": 12.0,
      "DUMBO": 2.5,
      "Greenpoint": 3.0,
      "Sunset Park": 6.0,
      "Bay Ridge": 8.0
    },
    "Queens": {
      "Astoria": 5.0,
      "Long Island City": 4.0,
      "Flushing": 10.0,
      "Jackson Heights": 8.0,
      "Ridgewood": 5.0
    },
    "Bronx": {
      "Riverdale": 12.0,
      "Pelham Bay": 15.0
    },
    "Staten Island": {
      "St. George": 14.0,
      "New Dorp": 16.0,
      "Mid Island": 15.7,
      "Shore Acres": 12.0,
      "South Beach": 13.5,
      "Clove Lakes": 13.9
    },
    "Jersey": {
        "Jersey City": 8.5,
        "Hoboken": 7.2
    }
  };
  
  // Flatten for calculations
  const soho_distances = {};
  Object.entries(neighborhoodsByBorough).forEach(([borough, neighborhoods]) => {
    Object.entries(neighborhoods).forEach(([neighborhood, distance]) => {
      soho_distances[neighborhood] = distance;
    });
  });
  
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  
  const calculateRisk = (neighborhood) => {
    const commute_miles = soho_distances[neighborhood] || 0;
    
    // Local club risk (assumed 1 mile round trip)
    const local_risk = 1 * base_fatality_rate;
    
    // SoHo commute risk
    const soho_risk = commute_miles * base_fatality_rate;
    
    const risk_reduction = soho_risk - local_risk;
    const percent_safer = (risk_reduction / soho_risk * 100) || 0;
    
    return {
      neighborhood,
      commute_miles,
      local_risk,
      soho_risk,
      percent_safer
    };
  };
  
  const handleSelectNeighborhood = (borough, neighborhood) => {
    setSelectedBorough(borough);
    setSelectedNeighborhood(neighborhood);
  };
  
  const handleCalculate = () => {
    if (selectedNeighborhood) {
      const result = calculateRisk(selectedNeighborhood);
      setCalculationResult(result);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">NYC Neighborhood Safety Calculator</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Select your location:</label>
        
        <div className="flex items-center space-x-2">
          <MultiLevelDropdown 
            neighborhoodsByBorough={neighborhoodsByBorough}
            onSelectNeighborhood={handleSelectNeighborhood}
          />
          
          {selectedNeighborhood && (
            <div className="text-sm text-black-700">
              Selected: <span className="font-medium">{selectedBorough} &gt; {selectedNeighborhood}</span>
            </div>
          )}
        </div>
      </div>
      
      <button 
        className={`w-full py-2 px-4 rounded text-white ${!selectedNeighborhood ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        onClick={handleCalculate}
        disabled={!selectedNeighborhood}
      >
        Calculate Safety Improvement
      </button>
      
      {calculationResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p className="mb-1 text-black-600"><strong>Neighborhood:</strong> {calculationResult.neighborhood}</p>
          {/*<p className="mb-1"><strong>Local club risk:</strong> {calculationResult.local_risk.toExponential(2)} fatalities/mile</p>
          <p className="mb-1"><strong>SoHo commute risk ({calculationResult.commute_miles}mi):</strong> {calculationResult.soho_risk.toExponential(2)} fatalities</p>*/}
          <p className="font-bold text-green-600"><strong>Safety improvement:</strong> {calculationResult.percent_safer.toFixed(1)}% reduction</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Based on 2024 NYC traffic data</p>
        <p>Calculation assumes 1-mile round trip for local travel</p>
      </div>
    </div>
  );
};

export default NYCSafetyCalculator;