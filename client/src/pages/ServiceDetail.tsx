import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Share, Heart, Star, MapPin, Clock, Phone, MessageCircle, Wifi, Car, Coffee, ShowerHead } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Service, ServiceOffering, Review } from "@shared/schema";

export default function ServiceDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOffering, setSelectedOffering] = useState<ServiceOffering | null>(null);

  const { data: service, isLoading: serviceLoading } = useQuery<Service>({
    queryKey: ["/api/services", id],
  });

  const { data: offerings = [] } = useQuery<ServiceOffering[]>({
    queryKey: ["/api/services", id, "offerings"],
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/services", id, "reviews"],
    enabled: !!id,
  });

  const { data: favoriteStatus } = useQuery({
    queryKey: ["/api/favorites", id, "check"],
    enabled: isAuthenticated && !!id,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorite) {
        await apiRequest(`/api/favorites/${id}`, { method: "DELETE" });
      } else {
        await apiRequest("/api/favorites", { 
          method: "POST", 
          body: { serviceId: id } 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: favoriteStatus?.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: favoriteStatus?.isFavorite 
          ? "Service removed from your favorites" 
          : "Service added to your favorites",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  const handleCall = () => {
    if (service?.phone) {
      window.open(`tel:${service.phone}`, '_self');
    }
  };

  const handleWhatsApp = () => {
    if (service?.phone) {
      const message = `Hi, I would like to book a service at ${service.name}`;
      const whatsappUrl = `https://wa.me/${service.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.name,
          text: `Check out ${service?.name} on ServiceFinder`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Service link copied to clipboard",
      });
    }
  };

  if (serviceLoading) {
    return (
      <div className="pb-20">
        <div className="relative h-64 bg-gray-200 animate-pulse"></div>
        <div className="p-4 space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500">Service not found</p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    "Free WiFi": Wifi,
    "Parking": Car,
    "Steam Room": ShowerHead,
    "Refreshments": Coffee,
  };

  return (
    <div className="pb-20" data-testid="screen-service-detail">
      {/* Hero Image */}
      <div className="relative">
        <img
          src={service.images?.[0] || "https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
          alt={service.name}
          className="w-full h-64 object-cover"
          data-testid="img-service-hero"
        />
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/30"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/30"
            onClick={handleShare}
            data-testid="button-share"
          >
            <Share className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/30"
            onClick={() => toggleFavoriteMutation.mutate()}
            disabled={!isAuthenticated}
            data-testid="button-favorite"
          >
            <Heart className={`h-4 w-4 ${favoriteStatus?.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Service Information */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-service-name">
              {service.name}
            </h1>
            <p className="text-gray-500 mb-2">{service.category} • {service.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{service.address}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Open until 9 PM</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Star className="h-4 w-4 text-accent fill-current" />
              <span className="font-semibold" data-testid="text-rating">
                {service.rating || "0"}
              </span>
              <span className="text-gray-500 text-sm">({service.reviewCount || 0})</span>
            </div>
            <p className="text-primary font-bold text-xl" data-testid="text-price">
              {service.priceRange || "Starting ₹999"}
            </p>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex space-x-3 mb-6">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center space-x-2"
            onClick={handleCall}
            data-testid="button-call"
          >
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </Button>
          <Button
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
            onClick={handleWhatsApp}
            data-testid="button-whatsapp"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
            <TabsTrigger value="location" data-testid="tab-location">Location</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description || "Experience ultimate relaxation at our luxury spa offering traditional and modern wellness treatments. Our expert therapists provide personalized care in a serene environment designed for your complete rejuvenation."}
              </p>
            </div>

            {service.amenities && service.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {service.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Wifi;
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Working Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Saturday - Sunday</span>
                  <span className="font-medium">8:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            {offerings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No services available</p>
            ) : (
              offerings.map((offering) => (
                <div
                  key={offering.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedOffering?.id === offering.id ? "border-primary bg-primary/5" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedOffering(offering)}
                  data-testid={`service-offering-${offering.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{offering.name}</h4>
                      <p className="text-gray-500 text-sm">{offering.duration} minutes</p>
                    </div>
                    <span className="text-primary font-semibold">₹{offering.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{offering.description}</p>
                  <Button
                    size="sm"
                    className={selectedOffering?.id === offering.id ? "bg-primary" : ""}
                    variant={selectedOffering?.id === offering.id ? "default" : "outline"}
                  >
                    {selectedOffering?.id === offering.id ? "Selected" : "Select"}
                  </Button>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">U</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">User</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-accent fill-current" />
                          <span className="text-sm text-gray-600">{review.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                      <span className="text-gray-400 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Map integration would go here</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">{service.address}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Book Now Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t max-w-md mx-auto">
        <Link href={`/booking/${service.id}`}>
          <Button 
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg"
            data-testid="button-book-now"
          >
            Book Now - {selectedOffering ? `₹${selectedOffering.price}` : service.priceRange}
          </Button>
        </Link>
      </div>
    </div>
  );
}
