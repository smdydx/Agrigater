
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const {width, height} = Dimensions.get('window');

const serviceMarkers = [
  {
    id: 1,
    title: 'Luxe Spa & Wellness',
    description: 'Premium spa services',
    coordinate: {latitude: 28.6139, longitude: 77.2090},
    category: 'spa',
  },
  {
    id: 2,
    title: 'Elite Hair Salon',
    description: 'Professional hair care',
    coordinate: {latitude: 28.6129, longitude: 77.2295},
    category: 'salon',
  },
  {
    id: 3,
    title: 'Relax Massage Center',
    description: 'Therapeutic massages',
    coordinate: {latitude: 28.6219, longitude: 77.2190},
    category: 'massage',
  },
];

export default function MapScreen({navigation}) {
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

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
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(location);
        setRegion({
          ...location,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => {
        console.log('Location error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getMarkerIcon = category => {
    switch (category) {
      case 'spa':
        return 'spa';
      case 'salon':
        return 'content-cut';
      case 'massage':
        return 'healing';
      default:
        return 'place';
    }
  };

  const filteredMarkers = serviceMarkers.filter(
    marker => selectedFilter === 'all' || marker.category === selectedFilter,
  );

  const filters = [
    {id: 'all', name: 'All', icon: 'apps'},
    {id: 'spa', name: 'Spa', icon: 'spa'},
    {id: 'salon', name: 'Salon', icon: 'content-cut'},
    {id: 'massage', name: 'Massage', icon: 'healing'},
  ];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}>
        {filteredMarkers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onCalloutPress={() =>
              navigation.navigate('ServiceDetail', {
                service: {
                  id: marker.id,
                  name: marker.title,
                  category: marker.description,
                  rating: 4.8,
                  price: 'Starting ₹999',
                  distance: '0.5 km',
                  phone: '+91-9876543210',
                },
              })
            }>
            <View style={[styles.markerContainer, {backgroundColor: '#4A90E2'}]}>
              <Icon
                name={getMarkerIcon(marker.category)}
                size={20}
                color="#fff"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter.id)}>
            <Icon
              name={filter.icon}
              size={20}
              color={selectedFilter === filter.id ? '#fff' : '#666'}
            />
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.activeFilterText,
              ]}>
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={getCurrentLocation}>
        <Icon name="my-location" size={24} color="#4A90E2" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  filterContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeFilter: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: '#fff',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
