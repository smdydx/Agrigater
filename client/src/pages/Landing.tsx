import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Waves, Search, Calendar, Gift } from "lucide-react";

const onboardingData = [
  {
    id: 1,
    title: "Find Nearby Services",
    description: "Discover spas, salons, and massage centers around you with real-time location tracking",
    icon: Search,
  },
  {
    id: 2,
    title: "Book Instantly",
    description: "Quick and easy booking with just a few taps",
    icon: Calendar,
  },
  {
    id: 3,
    title: "Get Exclusive Offers",
    description: "Save money with special discounts and deals",
    icon: Gift,
  },
];

export default function Landing() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      setShowOnboarding(true);
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleLogin();
    }
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center z-50">
        <div className="text-center text-white animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center">
            <Waves className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold mb-2">ServiceFinder</h1>
          <p className="text-white/80">Find nearby services</p>
          <div className="mt-8">
            <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    const currentData = onboardingData[currentSlide];
    const IconComponent = currentData.icon;

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-purple-200 rounded-3xl flex items-center justify-center">
              <IconComponent className="text-6xl text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentData.title}</h2>
            <p className="text-gray-600 leading-relaxed">{currentData.description}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-center space-x-2 mb-6">
            {onboardingData.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
          <Button 
            onClick={handleNext} 
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold"
            data-testid="button-continue"
          >
            {currentSlide === onboardingData.length - 1 ? "Get Started" : "Continue"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Waves className="text-2xl text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold"
              data-testid="button-login"
            >
              Continue with Replit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
