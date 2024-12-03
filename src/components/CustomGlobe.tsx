import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Monitor, Plane } from 'lucide-react';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="hidden md:flex h-[400px] items-center justify-center bg-gray-800/50">
      <div className="text-blue-400 text-xl">Loading globe visualization...</div>
    </div>
  )
});

const CustomGlobe = () => {
  const [dimensions, setDimensions] = useState<{ width: number, height: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const locations = useMemo(() => [
// Cities visited
{ name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194, type: "visited" },
{ name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, type: "visited" },
{ name: "Philadelphia", country: "USA", lat: 39.9526, lng: -75.1652, type: "visited" },
{ name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298, type: "visited" },
{ name: "Portland", country: "USA", lat: 45.5155, lng: -122.6789, type: "visited" },
{ name: "Las Vegas", country: "USA", lat: 36.1699, lng: -115.1398, type: "visited" },
{ name: "Reno", country: "USA", lat: 39.5296, lng: -119.8138, type: "visited" },
{ name: "Cabo San Lucas", country: "Mexico", lat: 22.8905, lng: -109.9167, type: "visited" },

{ name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, type: "dream" },
{ name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681, type: "dream" },
{ name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, type: "dream" },
{ name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, type: "dream" },
{ name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, type: "dream" },
{ name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694, type: "dream" },
{ name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, type: "dream" },
{ name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.0920, type: "dream" },
{ name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, type: "dream" },

// Europe
{ name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, type: "dream" },
{ name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, type: "dream" },
{ name: "Venice", country: "Italy", lat: 45.4408, lng: 12.3155, type: "dream" },
{ name: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558, type: "dream" },
{ name: "London", country: "UK", lat: 51.5074, lng: -0.1278, type: "dream" },
{ name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734, type: "dream" },
{ name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, type: "dream" },
{ name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, type: "dream" },
{ name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, type: "dream" },
{ name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378, type: "dream" },
{ name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738, type: "dream" },
{ name: "Santorini", country: "Greece", lat: 36.3932, lng: 25.4615, type: "dream" },
{ name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275, type: "dream" },

// Oceania
{ name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, type: "dream" },
{ name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, type: "dream" },
{ name: "Auckland", country: "New Zealand", lat: -36.8509, lng: 174.7645, type: "dream" },
{ name: "Queenstown", country: "New Zealand", lat: -45.0312, lng: 168.6626, type: "dream" },

// South America
{ name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, type: "dream" },
{ name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, type: "dream" },
{ name: "Machu Picchu", country: "Peru", lat: -13.1631, lng: -72.5450, type: "dream" },
{ name: "Cusco", country: "Peru", lat: -13.5319, lng: -71.9675, type: "dream" },

// Africa
{ name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, type: "dream" },
{ name: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811, type: "dream" },
{ name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, type: "dream" },
{ name: "Victoria Falls", country: "Zimbabwe", lat: -17.9243, lng: 25.8572, type: "dream" }
  ], []);

  const iter_locations = useMemo(() => [
    { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, type: "dream", nextUp: true },
    { name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681, type: "dream", nextUp: true },
    { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, type: "dream", nextUp: true },
    { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, type: "dream" },
    { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, type: "dream" }
  ], []);

  const customMarker = (type: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.beginPath();
    if (type === 'visited') {
      const points = 5;
      const outerRadius = 12;
      const innerRadius = 6;
      
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points;
        const x = radius * Math.cos(angle) + 16;
        const y = radius * Math.sin(angle) + 16;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.fillStyle = '#60A5FA';
    } else {
      ctx.moveTo(16, 8);
      ctx.bezierCurveTo(16, 6, 14, 4, 10, 4);
      ctx.bezierCurveTo(4, 4, 4, 12, 4, 12);
      ctx.bezierCurveTo(4, 18, 16, 24, 16, 24);
      ctx.bezierCurveTo(28, 18, 28, 12, 28, 12);
      ctx.bezierCurveTo(28, 12, 28, 4, 22, 4);
      ctx.bezierCurveTo(18, 4, 16, 6, 16, 8);
      ctx.fillStyle = '#c084fc';
    }
    
    ctx.fill();
    return canvas.toDataURL();
  };

  useEffect(() => {
    setMounted(true);
    
    const updateDimensions = () => {
      const container = document.getElementById('globe-container');
      if (container) {
        container.getBoundingClientRect();
        setDimensions({
          width: container.offsetWidth,
          height: 400
        });
      }
    };

    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const MobileView = () => (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-3 mb-6 text-blue-400">
        <Monitor className="h-6 w-6" />
        <p className="text-lg">Enjoy the full experience in desktop mode!</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-blue-400 text-xl font-medium mb-3">Places Visited:</h3>
          <div className="grid grid-cols-2 gap-3">
            {locations.filter(loc => loc.type === "visited").map(loc => (
              <div key={loc.name} className="text-gray-300 text-base">
                {loc.name}, {loc.country}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-blue-400 text-xl font-medium mb-3">Next Destinations:</h3>
          <div className="grid grid-cols-2 gap-3">
            {locations.filter(loc => loc.type === "dream" && loc.nextUp).map(loc => (
              <div key={loc.name} className="text-gray-300 text-base">
                {loc.name}, {loc.country}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mobile View */}
      <div className="md:hidden">
        <MobileView />
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-7 gap-8">
        {/* Globe taking 60% */}
        <div 
          id="globe-container" 
          className="col-span-4 h-[400px] relative"
        >
          {dimensions && (
            <Globe
              width={dimensions.width}
              height={dimensions.height}
              globeImageUrl="/earth-blue.jpg"
              backgroundImageUrl="/earth-night.png"
              pointsData={locations}
              pointAltitude={0.08}
              pointColor={d => d.type === "visited" ? "#60A5FA" : "#c084fc"}
              pointRadius={0.2}
              pointsMerge={true}
              htmlElementsData={locations}
              htmlElement={d => {
                const el = document.createElement('img');
                el.src = customMarker(d.type);
                el.style.width = '24px';
                el.style.height = '24px';
                el.style.translate = '-5% -5%';
                el.title = `${d.name}, ${d.country}`;
                return el;
              }}
              htmlLat={d => d.lat}
              htmlLng={d => d.lng}
              htmlAltitude={0.08}
              atmosphereColor="#4299e1"
              atmosphereAltitude={0.4}
              dragRotateSpeed={1.5}
              transitionDuration={500}
              enablePointerInteraction={true}
              animateIn={true}
            />
          )}
        </div>

        {/* Travel Info taking 40% */}
        <div className="col-span-3 flex flex-col justify-center space-y-8 p-4">
          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              <span className="text-gray-300 text-lg">Places Visited</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-purple-400"></div>
              <span className="text-gray-300 text-lg">Dream Destinations</span>
            </div>
          </div>

          {/* Next Up Section */}
          <div className="rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Plane className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-medium text-blue-400">Next Up On The Itinerary</h3>
            </div>
            <div className="space-y-3">
              {iter_locations
                .filter(loc => loc.type === "dream" && loc.nextUp)
                .map(loc => (
                  <div key={loc.name} className="text-gray-300 text-lg">
                    {loc.name}, {loc.country}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomGlobe;