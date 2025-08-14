
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Calendar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

const services = [
  {id: 1, name: 'Full Body Massage', price: 1999, duration: '90 min'},
  {id: 2, name: 'Facial Treatment', price: 999, duration: '60 min'},
  {id: 3, name: 'Hair Spa', price: 799, duration: '45 min'},
];

const paymentMethods = [
  {id: 1, name: 'Credit/Debit Card', icon: 'payment'},
  {id: 2, name: 'UPI', icon: 'phone-android'},
  {id: 3, name: 'Wallet', icon: 'account-balance-wallet'},
  {id: 4, name: 'Cash on Service', icon: 'money'},
];

export default function BookingFlowScreen({navigation, route}) {
  const {service} = route.params;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleServiceSelect = (serviceItem) => {
    const isSelected = selectedServices.find(s => s.id === serviceItem.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== serviceItem.id));
    } else {
      setSelectedServices([...selectedServices, serviceItem]);
    }
  };

  const getTotalAmount = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || selectedServices.length === 0 || !selectedPayment) {
      Alert.alert('Error', 'Please complete all steps to book');
      return;
    }

    Alert.alert(
      'Booking Confirmed!',
      `Your booking at ${service.name} has been confirmed.\nBooking ID: BK${Date.now().toString().slice(-6)}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MainTabs', {screen: 'Bookings'}),
        },
      ],
    );
  };

  const renderDateSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Date</Text>
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarPlaceholder}>Calendar will be here</Text>
        <View style={styles.dateGrid}>
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dateItem,
                selectedDate === day && styles.selectedDate,
              ]}
              onPress={() => setSelectedDate(day)}>
              <Text
                style={[
                  styles.dateText,
                  selectedDate === day && styles.selectedDateText,
                ]}>
                Jan {20 + day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderTimeSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Time</Text>
      <View style={styles.timeGrid}>
        {timeSlots.map(time => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              selectedTime === time && styles.selectedTimeSlot,
            ]}
            onPress={() => setSelectedTime(time)}>
            <Text
              style={[
                styles.timeText,
                selectedTime === time && styles.selectedTimeText,
              ]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderServiceSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Services</Text>
      {services.map(serviceItem => {
        const isSelected = selectedServices.find(s => s.id === serviceItem.id);
        return (
          <TouchableOpacity
            key={serviceItem.id}
            style={[
              styles.serviceOption,
              isSelected && styles.selectedServiceOption,
            ]}
            onPress={() => handleServiceSelect(serviceItem)}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{serviceItem.name}</Text>
              <Text style={styles.serviceDuration}>{serviceItem.duration}</Text>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.servicePrice}>₹{serviceItem.price}</Text>
              {isSelected && (
                <Icon name="check-circle" size={24} color="#4A90E2" />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPaymentSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Payment Method</Text>
      {paymentMethods.map(method => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentOption,
            selectedPayment === method.id && styles.selectedPaymentOption,
          ]}
          onPress={() => setSelectedPayment(method.id)}>
          <View style={styles.paymentLeft}>
            <Icon name={method.icon} size={24} color="#666" />
            <Text style={styles.paymentText}>{method.name}</Text>
          </View>
          {selectedPayment === method.id && (
            <Icon name="radio-button-checked" size={24} color="#4A90E2" />
          )}
          {selectedPayment !== method.id && (
            <Icon name="radio-button-unchecked" size={24} color="#666" />
          )}
        </TouchableOpacity>
      ))}
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Amount: ₹{getTotalAmount()}</Text>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderDateSelection();
      case 2:
        return renderTimeSelection();
      case 3:
        return renderServiceSelection();
      case 4:
        return renderPaymentSelection();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDate !== null;
      case 2:
        return selectedTime !== null;
      case 3:
        return selectedServices.length > 0;
      case 4:
        return selectedPayment !== null;
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map(step => (
            <View
              key={step}
              style={[
                styles.progressStep,
                step <= currentStep && styles.activeProgressStep,
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>Step {currentStep} of 4</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceCategory}>{service.category}</Text>
        </View>

        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.disabledButton,
            ]}
            onPress={() => {
              if (currentStep === 4) {
                handleBooking();
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={!canProceed()}>
            <Text style={styles.nextButtonText}>
              {currentStep === 4 ? 'Book Now' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    padding: 20,
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeProgressStep: {
    backgroundColor: '#4A90E2',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  serviceHeader: {
    marginBottom: 30,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceCategory: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  calendarContainer: {
    alignItems: 'center',
  },
  calendarPlaceholder: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateItem: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  selectedDate: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  dateText: {
    fontSize: 12,
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedTimeSlot: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
  },
  serviceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  selectedServiceOption: {
    borderColor: '#4A90E2',
    backgroundColor: '#f0f7ff',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  serviceRight: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  selectedPaymentOption: {
    borderColor: '#4A90E2',
    backgroundColor: '#f0f7ff',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  totalContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 0.4,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 0.55,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
