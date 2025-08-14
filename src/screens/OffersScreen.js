
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const offers = [
  {
    id: 1,
    title: '50% Off First Booking',
    description: 'Get 50% discount on your first spa booking',
    discount: '50% OFF',
    validTill: '2024-02-15',
    code: 'FIRST50',
    minAmount: 1000,
    category: 'spa',
  },
  {
    id: 2,
    title: 'Buy 1 Get 1 Free',
    description: 'Book one massage session and get one free',
    discount: 'BOGO',
    validTill: '2024-02-20',
    code: 'MASSAGE2X',
    minAmount: 1500,
    category: 'massage',
  },
  {
    id: 3,
    title: 'Salon Special',
    description: 'Flat ₹200 off on salon services',
    discount: '₹200 OFF',
    validTill: '2024-02-25',
    code: 'SALON200',
    minAmount: 800,
    category: 'salon',
  },
  {
    id: 4,
    title: 'Weekend Deal',
    description: '30% off on weekend bookings',
    discount: '30% OFF',
    validTill: '2024-02-28',
    code: 'WEEKEND30',
    minAmount: 500,
    category: 'all',
  },
  {
    id: 5,
    title: 'New User Bonus',
    description: 'Extra 25% off for new users',
    discount: '25% OFF',
    validTill: '2024-03-01',
    code: 'NEWBIE25',
    minAmount: 600,
    category: 'all',
  },
];

export default function OffersScreen({navigation}) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'spa':
        return '#FF6B6B';
      case 'salon':
        return '#4ECDC4';
      case 'massage':
        return '#45B7D1';
      default:
        return '#96CEB4';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'spa':
        return 'spa';
      case 'salon':
        return 'content-cut';
      case 'massage':
        return 'healing';
      default:
        return 'local-offer';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysLeft = (validTill) => {
    const today = new Date();
    const endDate = new Date(validTill);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Offers & Discounts</Text>
        <View />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Text style={styles.subtitle}>Save more on your bookings!</Text>

        {offers.map((offer) => {
          const daysLeft = getDaysLeft(offer.validTill);
          return (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerHeader}>
                <View style={styles.offerLeft}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: getCategoryColor(offer.category) },
                    ]}>
                    <Icon
                      name={getCategoryIcon(offer.category)}
                      size={20}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.offerInfo}>
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <Text style={styles.offerDescription}>
                      {offer.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{offer.discount}</Text>
                </View>
              </View>

              <View style={styles.offerDetails}>
                <View style={styles.detailRow}>
                  <Icon name="code" size={16} color="#666" />
                  <Text style={styles.detailText}>Code: {offer.code}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="shopping-cart" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    Min order: ₹{offer.minAmount}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="schedule" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    Valid till: {formatDate(offer.validTill)}
                  </Text>
                </View>
              </View>

              <View style={styles.offerFooter}>
                <View style={styles.timeLeft}>
                  {daysLeft > 0 ? (
                    <Text style={styles.timeLeftText}>
                      {daysLeft} days left
                    </Text>
                  ) : (
                    <Text style={[styles.timeLeftText, { color: '#F44336' }]}>
                      Expired
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.useButton,
                    daysLeft <= 0 && styles.disabledButton,
                  ]}
                  disabled={daysLeft <= 0}>
                  <Text style={styles.useButtonText}>Use Offer</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={styles.bottomSpacing} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  offerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  discountBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerDetails: {
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
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  timeLeft: {
    flex: 1,
  },
  timeLeftText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  useButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  useButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 20,
  },
});
