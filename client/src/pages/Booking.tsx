import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import BookingConfirmationModal from "@/components/BookingConfirmationModal";
import type { Service, ServiceOffering } from "@shared/schema";

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const generateDateOptions = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export default function Booking() {
  const { serviceId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedOffering, setSelectedOffering] = useState<ServiceOffering | null>(null);
  const [customerName, setCustomerName] = useState(user?.firstName + " " + (user?.lastName || "") || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const dateOptions = generateDateOptions();

  const { data: service } = useQuery<Service>({
    queryKey: ["/api/services", serviceId],
  });

  const { data: offerings = [] } = useQuery<ServiceOffering[]>({
    queryKey: ["/api/services", serviceId, "offerings"],
    enabled: !!serviceId,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await apiRequest("/api/bookings", {
        method: "POST",
        body: bookingData,
      });
    },
    onSuccess: (data) => {
      setBookingId(data.id);
      setShowConfirmation(true);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
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
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !selectedOffering || !customerName || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const bookingDateTime = new Date(selectedDate);
    const [time, period] = selectedTime.split(" ");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    
    bookingDateTime.setHours(hour24, parseInt(minutes), 0, 0);

    const bookingData = {
      serviceId,
      offeringId: selectedOffering.id,
      bookingDate: bookingDateTime.toISOString(),
      totalAmount: calculateTotal(),
      paymentMethod,
      customerName,
      customerPhone,
    };

    createBookingMutation.mutate(bookingData);
  };

  const calculateSubtotal = () => {
    return selectedOffering?.price ? parseFloat(selectedOffering.price) : 0;
  };

  const calculateConvenienceFee = () => {
    return 20;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.2); // 20% discount
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const convenienceFee = calculateConvenienceFee();
    const discount = calculateDiscount();
    return subtotal + convenienceFee - discount;
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500">Service not found</p>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20" data-testid="screen-booking">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-gray-100 rounded-full"
            onClick={() => setLocation(`/services/${serviceId}`)}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold text-gray-900" data-testid="text-header">Book Appointment</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Service Summary */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Service Details</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium" data-testid="text-service-name">{service.name}</p>
              <p className="text-gray-500 text-sm">{service.category}</p>
            </div>
            <span className="text-primary font-bold" data-testid="text-service-price">
              {service.priceRange}
            </span>
          </div>
        </div>

        {/* Service Selection */}
        {offerings.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Select Service</h3>
            <div className="space-y-3">
              {offerings.map((offering) => (
                <div
                  key={offering.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedOffering?.id === offering.id ? "border-primary bg-primary/5" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedOffering(offering)}
                  data-testid={`offering-${offering.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{offering.name}</h4>
                      <p className="text-gray-500 text-sm">{offering.duration} minutes</p>
                    </div>
                    <span className="text-primary font-semibold">₹{offering.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Selection */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Select Date</h3>
          <div className="grid grid-cols-7 gap-2">
            {dateOptions.map((date, index) => (
              <button
                key={index}
                className={`text-center p-3 rounded-lg border transition-colors ${
                  selectedDate?.toDateString() === date.toDateString()
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedDate(date)}
                data-testid={`date-${index}`}
              >
                <div className="text-xs">
                  {date.toLocaleDateString("en", { weekday: "short" })}
                </div>
                <div className="font-semibold">{date.getDate()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Select Time</h3>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`p-3 rounded-lg border font-medium transition-colors ${
                  selectedTime === time
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTime(time)}
                data-testid={`time-${time}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Full Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              data-testid="input-name"
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              data-testid="input-phone"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center p-4 border border-primary rounded-xl bg-primary/5">
              <RadioGroupItem value="online" id="online" className="mr-3" />
              <div className="flex-1">
                <Label htmlFor="online" className="font-medium text-gray-900">Pay Online</Label>
                <p className="text-gray-500 text-sm">Credit/Debit Card, UPI, Wallet</p>
              </div>
              <CreditCard className="text-primary h-5 w-5" />
            </div>
            <div className="flex items-center p-4 border border-gray-200 rounded-xl">
              <RadioGroupItem value="cash" id="cash" className="mr-3" />
              <div className="flex-1">
                <Label htmlFor="cash" className="font-medium text-gray-900">Pay at Venue</Label>
                <p className="text-gray-500 text-sm">Cash or Card at the service location</p>
              </div>
              <Banknote className="text-gray-400 h-5 w-5" />
            </div>
          </RadioGroup>
        </div>

        {/* Booking Summary */}
        {selectedOffering && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Service Price</span>
                <span>₹{selectedOffering.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Convenience Fee</span>
                <span>₹{calculateConvenienceFee()}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount (20% OFF)</span>
                <span>-₹{calculateDiscount()}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="text-primary" data-testid="text-total">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Booking Button */}
        <Button
          onClick={handleConfirmBooking}
          disabled={createBookingMutation.isPending || !selectedOffering}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg"
          data-testid="button-confirm-booking"
        >
          {createBookingMutation.isPending
            ? "Confirming..."
            : `Confirm Booking - ₹${calculateTotal()}`}
        </Button>
      </div>

      {showConfirmation && bookingId && (
        <BookingConfirmationModal
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setLocation("/");
          }}
          bookingId={bookingId}
          service={service}
          selectedOffering={selectedOffering}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          totalAmount={calculateTotal()}
        />
      )}
    </div>
  );
}
