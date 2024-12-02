import React, { useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualization = () => {
  const [points, setPoints] = useState([]);
  
  const visitedLocations = [
    { name: "California", lat: 36.7783, lng: -119.4179, type: "visited" },
    { name: "Nevada", lat: 39.5501, lng: -116.7502, type: "visited" },
    { name: "Idaho", lat: 44.0682, lng: -114.7420, type: "visited" },
    { name: "Texas", lat: 31.9686, lng: -99.9018, type: "visited" },
    { name: "Oregon", lat: 43.8041, lng: -120.5542, type: "visited" },
    { name: "Washington", lat: 47.7511, lng: -120.7401, type: "visited" },
    { name: "Pennsylvania", lat: 41.2033, lng: -77.1945, type: "visited" },
    { name: "Illinois", lat: 40.6331, lng: -89.3985, type: "visited" },
    { name: "Florida", lat: 27.6648, lng: -81.5158, type: "visited" },
    { name: "South Carolina", lat: 33.8361, lng: -81.1637, type: "visited" },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503, type: "dream" },
    { name: "Chongqing", lat: 29.4316, lng: 106.9123, type: "dream" },
    { name: "Singapore", lat: 1.3521, lng: 103.8198, type: "dream" },
    { name: "Palawan", lat: 9.8349, lng: 118.7384, type: "dream" },
    { name: "Bali", lat: -8.4095, lng: 115.1889, type: "dream" },
    { name: "Rome", lat: 41.8719, lng: 12.5674, type: "dream" },
    { name: "Toronto", lat: 43.6532, lng: -79.3832, type: "dream" },
    { name: "New York City", lat: 40.7128, lng: -74.0060, type: "dream" },
    { name: "Cabo San Lucas", lat: 22.8905, lng: -109.9167, type: "visited" }
  ];

  useEffect(() => {
    setPoints(visitedLocations.map(loc => ({
      lat: loc.lat,
      lng: loc.lng,
      size: 0.5,
      color: loc.type === 'visited' ? '#60A5FA' : '#F87171',
      label: loc.name
    })));
  }, []);

  return (
    <div className="h-[600px] w-full">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointColor="color"
        pointLabel="label"
        pointRadius="size"
        pointAltitude={0.01}
        atmosphereColor="#FFFFFF"
        atmosphereAltitude={0.1}
        globeRotation={{ lat: 20, lng: -100, altitude: 2.5 }}
        width={800}
        height={600}
      />
    </div>
  );
};

export default GlobeVisualization;