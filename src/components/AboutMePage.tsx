import React, { useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TypewriterText = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState(&apos;&apos;);
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    
    return () => clearInterval(timer);
  }, [text, delay]);
  
  return <span>{displayText}</span>;
};

const GlobeVisualization = () => {
  const [points, setPoints] = useState([]);
  
  const visitedLocations = useMemo(() => [
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
  ], []);

  useEffect(() => {
    const locations = visitedLocations.map(loc => ({
      lat: loc.lat,
      lng: loc.lng,
      size: 0.5,
      color: loc.type === "visited" ? "#60A5FA" : "#F87171",
      label: loc.name
    }));
    setPoints(locations);
  }, [visitedLocations]);

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

const AboutMePage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <nav className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-blue-400" />
            <span className="text-2xl font-bold">domm.dev</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 font-mono">
            <span className="text-blue-400">const</span>{' '}
            <span className="text-purple-400">aboutMe</span>{' '}
            <span className="text-blue-400">=</span>{' '}
            <span className="text-green-400">&quot;</span>
            <TypewriterText text="Get to know me" />
            <span className="text-green-400">&quot;</span>
          </div>

          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-gray-800/50 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-white">My Journey</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">
                  Through my travels, I&apos;ve gained unique perspectives that influence my approach to problem-solving 
                  and development. Below you&apos;ll find a visualization of places I&apos;ve visited and dream destinations 
                  that inspire my journey.
                </p>
              </CardContent>
            </Card>

            <div className={`mb-8 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <GlobeVisualization />
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                <span className="text-gray-300">Places I&apos;ve Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
                <span className="text-gray-300">Dream Destinations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;