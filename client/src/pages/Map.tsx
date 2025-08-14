import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Filter, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import ServiceCard from "@/components/ServiceCard";
import type { Service } from "@shared/schema";

const filters = [
  { id: "all", name: "All", icon: "apps" },
  { id: "spa", name: "Spa", icon: "spa" },
  { id: "salon", name: "Salon", icon: "scissors" },
  { id: "massage", name: "Massage", icon: "hands" },
];

export default function Map() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services", userLocation?.latitude, userLocation?.longitude, selectedFilter],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const filteredServices = selectedFilter === "all" 
    ? services 
    : services.filter(service => service.category === selectedFilter);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="pb-20" data-testid="screen-map">
      {/* Map Header */}
      <div className="bg-white p-4 shadow-sm border-b">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-gray-100 rounded-full"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-semibold text-gray-900" data-testid="text-header">Map View</h1>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-gray-100 rounded-full"
            data-testid="button-filter"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v15l-6 3-6-3z" />
              </svg>
            </div>
            <p className="font-medium">Interactive Map</p>
            <p className="text-sm">Live service locations would be displayed here</p>
          </div>
        </div>

        {/* Current Location Pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        {/* Service Pins */}
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="absolute top-1/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-secondary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Filter Container */}
        <div className="absolute top-4 left-4 right-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "secondary"}
                size="sm"
                className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium ${
                  selectedFilter === filter.id
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
                onClick={() => setSelectedFilter(filter.id)}
                data-testid={`filter-${filter.id}`}
              >
                {filter.name}
              </Button>
            ))}
          </div>
        </div>

        {/* My Location Button */}
        <Button
          size="icon"
          className="absolute bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 text-primary shadow-lg hover:bg-gray-50"
          onClick={getCurrentLocation}
          data-testid="button-my-location"
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Map Services List */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Services in this area ({filteredServices.length})
        </h3>
        
        {isLoading ? (
          <div className="space-y-3" data-testid="loading-services">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3" data-testid="services-list">
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500" data-testid="text-no-services">
                No services found in this area
              </div>
            ) : (
              filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <ServiceCard service={service} compact />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNavigation currentScreen="map" />
    </div>
  );
}
