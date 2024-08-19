import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import getURL from '@/components/src/URL';

const URL = getURL();

type RootTabParamList = {
  HomeStaff: { user: { FamilyName: string; Name: string; Email: string; Role: string; _id: string } };
};

type HomeStaffRouteProp = RouteProp<RootTabParamList, 'HomeStaff'>;

interface HomeStaffProps {
  route: HomeStaffRouteProp;
}

interface Availability {
  _id: string; // Assurez-vous que chaque disponibilité a un identifiant unique
  personnelId: string;
  Date: string;
  Shift: string;
  status: boolean;
}

const AvailabilityList: React.FC<HomeStaffProps> = ({ route }) => {
  const { user } = route.params;
  const [availabilityList, setAvailabilityList] = useState<Availability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const personnelId = user._id;
      console.log(personnelId);

      const response = await axios.get(`http://${URL}:3012/api/availability/perso/${personnelId}`);
      setAvailabilityList(response.data);
    } catch (err) {
      setError('Failed to fetch availability');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAvailability();
  };

  const renderItem = ({ item }: { item: Availability }) => (
    <View style={[styles.itemContainer, item.status ? styles.statusTrue : styles.statusFalse]}>
      <Text style={styles.text}>Date: {item.Date}</Text>
      <Text style={styles.text}>Shift: {item.Shift}</Text>
      <Text style={styles.text}>Status: {item.status ? 'Confirmed' : 'Not Confirmed'}</Text>
    </View>
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.title}>{user.FamilyName} {user.Name}'s Availability</Text>
      <FlatList
        data={availabilityList}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}  // Utiliser un identifiant unique pour chaque disponibilité
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  statusTrue: {
    backgroundColor: 'lightgreen',
  },
  statusFalse: {
    backgroundColor: 'lightcoral',
  },
  text: {
    fontSize: 16,
  },
  refreshButton: {
    backgroundColor: '#0D47A1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#0D47A1',
  },
});

export default AvailabilityList;
