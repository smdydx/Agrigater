
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const services = [
  {id: 1, name: 'Full Body Massage', price: '₹1999', duration: '90 min'},
  {id: 2, name: 'Facial Treatment', price: '₹999', duration: '60 min'},
  {id: 3, name: 'Hair Spa', price: '₹799', duration: '45 min'},
];

const reviews = [
  {
    id: 1,
    name: 'Rahul Kumar',
    rating: 5,
    comment: 'Excellent service! Very relaxing experience.',
    date: '2 days ago',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rating: 4,
    comment: 'Good ambiance and professional staff.',
    date: '1 week ago',
  },
];

export default function ServiceDetailScreen({navigation, route}) {
  const {service} = route.params;
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleCall = () => {
    Linking.openURL(`tel:${service.phone}`);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I would like to book a service at ${service.name}`;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
      message,
    )}&phone=${service.phone}`;
    Linking.openURL(whatsappUrl).catch(() =>
      Alert.alert('Error', 'WhatsApp not installed'),
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.description}>
              Experience luxury and relaxation at our premium wellness center.
              Our expert therapists provide world-class treatments in a serene
              environment.
            </Text>
            <Text style={styles.subheading}>Amenities</Text>
            <View style={styles.amenities}>
              <Text style={styles.amenity}>• Air Conditioning</Text>
              <Text style={styles.amenity}>• WiFi Available</Text>
              <Text style={styles.amenity}>• Parking Available</Text>
              <Text style={styles.amenity}>• Sanitized Environment</Text>
            </View>
          </View>
        );
      case 'services':
        return (
          <View style={styles.tabContent}>
            {services.map(item => (
              <View key={item.id} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={styles.serviceDuration}>{item.duration}</Text>
                </View>
                <Text style={styles.servicePrice}>{item.price}</Text>
              </View>
            ))}
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {reviews.map(review => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewRating}>
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="star"
                      size={16}
                      color={i < review.rating ? '#FFD700' : '#ddd'}
                    />
                  ))}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Icon name="favorite-border" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Icon name="business" size={100} color="#4A90E2" />
        </View>

        <View style={styles.content}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.category}>{service.category}</Text>

          <View style={styles.infoRow}>
            <View style={styles.rating}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{service.rating}</Text>
              <Text style={styles.reviewCount}>(127 reviews)</Text>
            </View>
            <Text style={styles.distance}>{service.distance}</Text>
          </View>

          <Text style={styles.price}>{service.price}</Text>

          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Icon name="call" size={20} color="#fff" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
              <Icon name="chat" size={20} color="#fff" />
              <Text style={styles.whatsappButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
              onPress={() => setSelectedTab('overview')}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'overview' && styles.activeTabText,
                ]}>
                Overview
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'services' && styles.activeTab]}
              onPress={() => setSelectedTab('services')}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'services' && styles.activeTabText,
                ]}>
                Services
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
              onPress={() => setSelectedTab('reviews')}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === 'reviews' && styles.activeTabText,
                ]}>
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {renderTabContent()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookingFlow', {service})}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    padding: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewCount: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
  },
  contactButtons: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
  },
  callButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 10,
  },
  whatsappButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  activeTab: {
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
  tabContent: {
    minHeight: 200,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  amenities: {
    marginLeft: 10,
  },
  amenity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
