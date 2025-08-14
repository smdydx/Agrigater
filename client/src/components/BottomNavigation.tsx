import { Link, useLocation } from "wouter";
import { Home, Map, Calendar, User } from "lucide-react";

interface BottomNavigationProps {
  currentScreen: string;
}

export default function BottomNavigation({ currentScreen }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "map", label: "Map", icon: Map, path: "/map" },
    { id: "bookings", label: "Bookings", icon: Calendar, path: "/bookings" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto" data-testid="bottom-navigation">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentScreen === item.id || location === item.path;
          
          return (
            <Link key={item.id} href={item.path}>
              <button
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  isActive ? "text-primary" : "text-gray-400"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <IconComponent className="text-xl mb-1 h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
