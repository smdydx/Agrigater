import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Heart, Wallet, Bell, Globe, Moon, LogOut, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import BottomNavigation from "@/components/BottomNavigation";
import type { Booking, Service } from "@shared/schema";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { data: favorites = [] } = useQuery<Service[]>({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="pb-20">
        <div className="bg-primary p-4 pt-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = bookings
    .filter(booking => booking.status === "completed")
    .reduce((total, booking) => total + parseFloat(booking.totalAmount), 0);

  return (
    <div className="pb-20" data-testid="screen-profile">
      {/* Profile Header */}
      <div className="bg-primary p-4 pt-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.firstName || "User"}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="text-white text-2xl" />
            )}
          </div>
          <h2 className="text-white font-semibold text-lg" data-testid="text-user-name">
            {user?.firstName || "User"} {user?.lastName || ""}
          </h2>
          <p className="text-white/80 text-sm" data-testid="text-user-email">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="font-bold text-xl text-primary" data-testid="text-bookings-count">
              {bookings.length}
            </div>
            <div className="text-gray-500 text-sm">Bookings</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="font-bold text-xl text-secondary" data-testid="text-favorites-count">
              {favorites.length}
            </div>
            <div className="text-gray-500 text-sm">Favorites</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="font-bold text-xl text-accent" data-testid="text-total-spent">
              ₹{totalSpent.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">Spent</div>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3" data-testid="menu-bookings">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-600 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">My Bookings</h3>
              <p className="text-gray-500 text-sm">View upcoming and past appointments</p>
            </div>
            <span className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          <div className="p-4 border-b border-gray-100 flex items-center space-x-3" data-testid="menu-favorites">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Heart className="text-red-600 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Favorites</h3>
              <p className="text-gray-500 text-sm">Your saved services and providers</p>
            </div>
            <span className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          <div className="p-4 border-b border-gray-100 flex items-center space-x-3" data-testid="menu-wallet">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Wallet className="text-green-600 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Wallet & Payments</h3>
              <p className="text-gray-500 text-sm">Manage payment methods</p>
            </div>
            <span className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          <div className="p-4 flex items-center space-x-3" data-testid="menu-notifications">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Bell className="text-purple-600 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-gray-500 text-sm">Booking updates and offers</p>
            </div>
            <span className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="text-gray-600 h-5 w-5" />
              <span className="font-medium text-gray-900">Language</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">English</span>
              <span className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="text-gray-600 h-5 w-5" />
              <span className="font-medium text-gray-900">Dark Mode</span>
            </div>
            <Switch data-testid="switch-dark-mode" />
          </div>

          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Bookings</h3>
            <div className="space-y-3">
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">₹{booking.totalAmount}</p>
                    <p className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === "completed" ? "bg-green-100 text-green-600" :
                      booking.status === "confirmed" ? "bg-blue-100 text-blue-600" :
                      booking.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation currentScreen="profile" />
    </div>
  );
}
