
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const bookingData = [
  {
    id: 1,
    serviceName: 'Luxe Spa & Wellness',
    service: 'Full Body Massage',
    date: '2024-01-25',
    time: '2:00 PM',
    status: 'confirmed',
    amount: '₹1999',
    bookingId: 'BK001',
  },
  {
    id: 2,
    serviceName: 'Elite Hair Salon',
    service: 'Hair Cut & Styling',
    date: '2024-01-22',
    time: '11:00 AM',
    status: 'completed',
    amount: '₹599',
    bookingId: 'BK002',
  },
  {
    id: 3,
    serviceName: 'Relax Massage Center',
    service: 'Swedish Massage',
    date: '2024-01-28',
    time: '4:00 PM',
    status: 'pending',
    amount: '₹1499',
    bookingId: 'BK003',
  },
];

export default function BookingScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'confirmed':
        return 'check-circle';
      case 'pending':
        return 'access-time';
      case 'completed':
        return 'done-all';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const filterBookings = () => {
    if (activeTab === 'upcoming') {
      return bookingData.filter(
        booking => booking.status === 'confirmed' || booking.status === 'pending',
      );
    } else {
      return bookingData.filter(booking => booking.status === 'completed');
    }
  };

  const renderBooking = booking => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.serviceName}>{booking.serviceName}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(booking.status)},
          ]}>
          <Icon
            name={getStatusIcon(booking.status)}
            size={14}
            color="#fff"
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.serviceType}>{booking.service}</Text>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Icon name="event" size={16} color="#666" />
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.detailText}>{booking.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="receipt" size={16} color="#666" />
          <Text style={styles.detailText}>ID: {booking.bookingId}</Text>
        </View>
      </View>

      <View style={styles.bookingFooter}>
        <Text style={styles.amount}>{booking.amount}</Text>
        <View style={styles.actionButtons}>
          {booking.status === 'pending' && (
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {booking.status === 'confirmed' && (
            <TouchableOpacity style={styles.rescheduleButton}>
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>
          )}
          {booking.status === 'completed' && (
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>Add Review</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filterBookings().length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="event-busy" size={80} color="#ddd" />
            <Text style={styles.emptyStateText}>No bookings found</Text>
            <Text style={styles.emptyStateSubtext}>
              Your {activeTab} bookings will appear here
            </Text>
          </View>
        ) : (
          filterBookings().map(booking => renderBooking(booking))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rescheduleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  rescheduleButtonText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#4A90E2',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});
