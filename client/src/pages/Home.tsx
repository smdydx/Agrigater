import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Bell, MapPin, Search, Mic, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import ServiceCard from "@/components/ServiceCard";
import CategoryCard from "@/components/CategoryCard";
import type { Service } from "@shared/schema";

const categories = [
  { id: "spa", name: "Spa", icon: "spa", gradient: "from-pink-100 to-pink-200", iconColor: "text-pink-600" },
  { id: "salon", name: "Salon", icon: "scissors", gradient: "from-blue-100 to-blue-200", iconColor: "text-blue-600" },
  { id: "massage", name: "Massage", icon: "hands", gradient: "from-green-100 to-green-200", iconColor: "text-green-600" },
  { id: "gym", name: "Gym", icon: "dumbbell", gradient: "from-purple-100 to-purple-200", iconColor: "text-purple-600" },
];

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services", userLocation?.latitude, userLocation?.longitude],
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

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20" data-testid="screen-home">
      {/* Header */}
      <div className="bg-primary p-4 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.[0] || "U"}
              </span>
            </div>
            <div>
              <p className="text-white/80 text-sm">Good morning</p>
              <p className="text-white font-semibold" data-testid="text-username">
                {user?.firstName || "User"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-white/20 rounded-full text-white hover:bg-white/30"
            data-testid="button-notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        {/* Location Display */}
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="text-white/80 text-sm" />
          <span className="text-white text-sm" data-testid="text-location">
            {userLocation ? "Current Location" : "Location not available"}
          </span>
          <ChevronDown className="text-white/80 text-xs" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for spas, salons, massage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-4 pl-12 pr-12 rounded-xl border-0 focus:ring-2 focus:ring-white/50"
            data-testid="input-search"
          />
          <Search className="absolute left-4 top-4 text-gray-400 h-4 w-4" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-2 text-gray-400"
            data-testid="button-voice-search"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Slider */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2" data-testid="category-list">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Top Offers Banner */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-accent to-orange-400 rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">Special Offers</h3>
            <p className="text-white/90 text-sm mb-3">Up to 40% off on spa services</p>
            <Button
              variant="secondary"
              className="bg-white text-accent hover:bg-gray-100"
              data-testid="button-view-offers"
            >
              View All Offers
            </Button>
          </div>
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>
      </div>

      {/* Nearby Services */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Nearby Services</h3>
          <Link href="/map">
            <Button variant="ghost" className="text-primary text-sm font-medium" data-testid="link-view-all">
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4" data-testid="loading-services">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-40 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4" data-testid="services-list">
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500" data-testid="text-no-services">
                No services found in your area
              </div>
            ) : (
              filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            )}
          </div>
        )}
      </div>

      <BottomNavigation currentScreen="home" />
    </div>
  );
}
