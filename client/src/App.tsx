import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import ServiceDetail from "@/pages/ServiceDetail";
import Booking from "@/pages/Booking";
import Profile from "@/pages/Profile";
import Map from "@/pages/Map";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/services/:id" component={ServiceDetail} />
          <Route path="/booking/:serviceId" component={Booking} />
          <Route path="/profile" component={Profile} />
          <Route path="/map" component={Map} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
