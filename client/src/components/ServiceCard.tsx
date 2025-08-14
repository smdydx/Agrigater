import { Link } from "wouter";
import { Star, MapPin, Clock, Phone, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  compact?: boolean;
}

export default function ServiceCard({ service, compact = false }: ServiceCardProps) {
  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (service.phone) {
      window.open(`tel:${service.phone}`, '_self');
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (service.phone) {
      const message = `Hi, I would like to book a service at ${service.name}`;
      const whatsappUrl = `https://wa.me/${service.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (compact) {
    return (
      <Link href={`/services/${service.id}`}>
        <div className="flex items-center space-x-3 cursor-pointer" data-testid={`service-card-${service.id}`}>
          <img
            src={service.images?.[0] || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"}
            alt={service.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900" data-testid="text-service-name">{service.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>0.8 km</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-accent fill-current" />
                <span>{service.rating || "0"}</span>
              </div>
            </div>
            <p className="text-primary font-semibold text-sm">{service.priceRange}</p>
          </div>
          <Button size="sm" className="bg-primary text-white" data-testid="button-book">
            Book
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/services/${service.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer" data-testid={`service-card-${service.id}`}>
        <div className="relative">
          <img
            src={service.images?.[0] || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
            alt={service.name}
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-3 left-3 bg-secondary text-white px-2 py-1 rounded-lg text-xs font-medium">
            20% OFF
          </div>
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
            <Heart className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900" data-testid="text-service-name">{service.name}</h4>
              <p className="text-gray-500 text-sm">{service.category} • {service.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-accent fill-current" />
                <span className="text-sm font-medium">{service.rating || "0"}</span>
              </div>
              <p className="text-gray-500 text-xs">({service.reviewCount || 0} reviews)</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>0.8 km</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>20 min</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary font-semibold" data-testid="text-price">{service.priceRange}</p>
            </div>
          </div>
          <div className="flex space-x-2 mt-3">
            <Button className="flex-1 bg-primary text-white" data-testid="button-book">
              Book Now
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10"
              onClick={handleCall}
              data-testid="button-call"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10"
              onClick={handleWhatsApp}
              data-testid="button-whatsapp"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
