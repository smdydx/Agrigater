
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const {width} = Dimensions.get('window');

const categories = [
  {id: 1, name: 'Spa', icon: 'spa', color: '#FF6B6B'},
  {id: 2, name: 'Salon', icon: 'content-cut', color: '#4ECDC4'},
  {id: 3, name: 'Massage', icon: 'healing', color: '#45B7D1'},
  {id: 4, name: 'Beauty', icon: 'face', color: '#96CEB4'},
];

const offers = [
  {id: 1, title: '50% Off First Booking', image: 'offer1'},
  {id: 2, title: 'Free Consultation', image: 'offer2'},
  {id: 3, title: 'Buy 1 Get 1 Free', image: 'offer3'},
];

const nearbyServices = [
  {
    id: 1,
    name: 'Luxe Spa & Wellness',
    category: 'Spa',
    rating: 4.8,
    price: 'Starting ₹999',
    distance: '0.5 km',
    image: 'spa1',
    phone: '+91-9876543210',
  },
  {
    id: 2,
    name: 'Elite Hair Salon',
    category: 'Salon',
    rating: 4.6,
    price: 'Starting ₹299',
    distance: '0.8 km',
    image: 'salon1',
    phone: '+91-9876543211',
  },
  {
    id: 3,
    name: 'Relax Massage Center',
    category: 'Massage',
    rating: 4.7,
    price: 'Starting ₹599',
    distance: '1.2 km',
    image: 'massage1',
    phone: '+91-9876543212',
  },
];

export default function HomeScreen({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === RESULTS.GRANTED) {
        getCurrentLocation();
      }
    } catch (error) {
      console.log('Location permission error:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
      },
      error => {
        console.log('Location error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderCategory = ({item}) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIcon, {backgroundColor: item.color}]}>
        <Icon name={item.icon} size={30} color="#fff" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderOffer = ({item}) => (
    <View style={styles.offerItem}>
      <View style={styles.offerImagePlaceholder}>
        <Icon name="local-offer" size={40} color="#4A90E2" />
      </View>
      <Text style={styles.offerTitle}>{item.title}</Text>
    </View>
  );

  const renderService = ({item}) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('ServiceDetail', {service: item})}>
      <View style={styles.serviceImagePlaceholder}>
        <Icon name="business" size={40} color="#4A90E2" />
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceCategory}>{item.category}</Text>
        <View style={styles.serviceDetails}>
          <View style={styles.rating}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.location}>
            <Icon name="location-on" size={16} color="#666" />
            {location ? ' Current Location' : ' Location not available'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account-circle" size={40} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity>
          <Icon name="mic" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Offers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Offers')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={offers}
          renderItem={renderOffer}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Services</Text>
        {nearbyServices.map((service, index) => (
          <View key={service.id}>{renderService({item: service})}</View>
        ))}
      </View>
    </ScrollView>
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
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  viewAll: {
    color: '#4A90E2',
    fontSize: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginLeft: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  offerItem: {
    width: 200,
    marginLeft: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  offerImagePlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    marginBottom: 10,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  serviceCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    marginLeft: 5,
    color: '#333',
    fontWeight: 'bold',
  },
  distance: {
    color: '#666',
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});
