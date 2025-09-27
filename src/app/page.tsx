"use client";

import { APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, Pin, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import CONSTANTS from "./constants";

interface Location {
  latitude: number,
  longitude: number
}

const LocationCircle = ({ center }: { center: google.maps.LatLngLiteral }) => {
  const map = useMap(); // Get the map instance

  useEffect(() => {
    if (!map) return; // Wait for map to be ready

    const circle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map, // Attach it to the map
      center: center,
      radius: 800, // Radius in meters
    });

    // Cleanup function to remove the circle when the component unmounts
    return () => {
      circle.setMap(null);
    };
  }, [map, center]);
  return null;
};


export default function Home() {
  const key = CONSTANTS.API_KEY;

  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const errorHandler = (err: GeolocationPositionError) => {
      setError(err.message);
      setLoading(false);
    };

    // Request the user's current position
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div>Loading your location...</div>;
  }

  if (error) {
    return <div>Error: {error}. Please allow location access and refresh.</div>;
  }
  
  return (
    <div className="relative w-screen h-screen">

      { isSidebarOpen && (
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-white shadow-lg z-20 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 flex-grow">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">High Priority Area</h2>
            <p className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full mt-2 inline-block">
              High Garbage Found
            </p>
          </div>

          {/* AI Summary Section */}
          <div className="mb-6">
            <h3 className="text-md font-bold text-gray-700 border-b pb-2 mb-3">
              AI Summary
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Users are complaining about the heavy garbage on the road and footpaths that is affecting the cleanliness of the city and also making it difficult for them to walk on the roads.
            </p>
          </div>

          {/* Issue Stats Section */}
          <div>
            <h3 className="text-md font-bold text-gray-700 border-b pb-2 mb-3">
              Issue Stats
            </h3>
            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-600">Raised in Past Hour:</span>
                    <span className="font-bold text-blue-600 text-lg">32</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-600">Issues Resolved:</span>
                    <span className="font-bold text-green-600 text-lg">0/32</span>
                </div>
            </div>
          </div>

          <div className="mt-5">
             <h3 className="text-md font-bold text-gray-700 border-b pb-2 mb-3">Recent Reports</h3>
             <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p className="text-gray-700">"The pile of trash near the corner store has doubled in size. It's becoming a health hazard."</p>
                    <p className="text-xs text-gray-500 text-right mt-1">- R. Sharma, 15 mins ago</p>
                </div>
                 <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p className="text-gray-700">"Can't use the footpath at all. Completely blocked by garbage bags."</p>
                    <p className="text-xs text-gray-500 text-right mt-1">- A. Verma, 28 mins ago</p>
                </div>
             </div>
          </div>

        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      )}
      
      {location && (
        <APIProvider apiKey={key}>
          <Map
            style={{ width: "100vw", height: "100vh" }}
            defaultZoom={13}
            defaultCenter={{ lat: location.latitude, lng: location.longitude }}
            mapId={"YOUR_CUSTOM_MAP_ID"}
          >
            {/* Use the new LocationCircle component here */}
            <LocationCircle center={{ lat: location.latitude, lng: location.longitude }} />

            {/* Marker and InfoWindow logic is still correct */}
            <AdvancedMarker
              position={{ lat: location.latitude, lng: location.longitude }}
              onClick={() => setInfoWindowOpen(true)}
            >
              <Pin background={"#FF0000"} borderColor={"#B30000"} glyphColor={"#FFFFFF"} />
            </AdvancedMarker>

            {infoWindowOpen && (
              <InfoWindow
                position={{ lat: location.latitude + 0.0015, lng: location.longitude }}
                onCloseClick={() => setInfoWindowOpen(false)}
              >
                <div style={{ padding: '0 10px 10px 10px' }}>
                  <h1 style={{ margin: 0, color: 'red' }}>Heavy Garbage Area</h1>
                  <p style={{ margin: '5px 0 0 0' }}>
                    Citizens are complaining heavily on garbage being thrown around the road and footpaths.
                  </p>
                  <button onClick={() => setIsSidebarOpen(true)} className="mt-2 text-blue-700 cursor-pointer">
                    See more info
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      )}
    </div>
  );

}
