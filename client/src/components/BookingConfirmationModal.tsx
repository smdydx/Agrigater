import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Service, ServiceOffering } from "@shared/schema";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  service: Service;
  selectedOffering: ServiceOffering | null;
  selectedDate: Date | null;
  selectedTime: string;
  totalAmount: number;
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  bookingId,
  service,
  selectedOffering,
  selectedDate,
  selectedTime,
  totalAmount,
}: BookingConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto" data-testid="booking-confirmation-modal">
        <DialogHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600 h-8 w-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </DialogTitle>
            <p className="text-gray-600 mb-4">Your appointment has been successfully booked</p>
          </div>
        </DialogHeader>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium" data-testid="text-booking-id">#{bookingId.slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium" data-testid="text-booking-datetime">
                {selectedDate?.toLocaleDateString("en", { 
                  weekday: "short", 
                  day: "numeric", 
                  month: "short" 
                })} • {selectedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium" data-testid="text-service-name">
                {selectedOffering?.name || service.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-primary" data-testid="text-total-amount">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onClose} 
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold"
            data-testid="button-view-details"
          >
            View Booking Details
          </Button>
          <Button 
            variant="outline"
            onClick={onClose} 
            className="w-full py-3 rounded-xl font-semibold"
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
