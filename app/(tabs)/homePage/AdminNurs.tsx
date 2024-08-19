import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Button, RefreshControl, TouchableOpacity, Platform, Modal, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Updated import
import axios from 'axios';
import getURL from '@/components/src/URL';

const URL = getURL();

interface Availability {
  _id: string;
  personnelId: string;
  Date: string;
  Shift: string;
  status: boolean;
}

interface Personnel {
  _id: string;
  Name: string;
  FamilyName: string;
}

const AdminNurs = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<{ [key: string]: Personnel }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Availability | null>(null);
  const [status, setStatus] = useState<string>('');

  // Fetch all availability
  const fetchAvailability = async () => {
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      const response = await axios.get<Availability[]>(`http://${URL}:3012/api/availability/all`);
      const availabilityData = response.data;
      setAvailability(availabilityData);

      const doctorIds = availabilityData.map((item) => item.personnelId);
      const uniqueDoctorIds = [...new Set(doctorIds)];

      console.log('Unique Doctor IDs:', uniqueDoctorIds); // Log unique doctor IDs

      await Promise.all(uniqueDoctorIds.map(async (id) => {
        try {
          const doctorResponse = await axios.get<Personnel>(`http://${URL}:3002/api/doctors/profile/${id}`);
          setDoctorInfo((prevState) => ({
            ...prevState,
            [id]: doctorResponse.data
          }));
        } catch (error) {
          console.error(`Error fetching doctor info for ID ${id}:`, error);
        }
      }));

    } catch (error) {
      console.error('Error fetching availability data:', error);
      setError('Error fetching availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAvailability().finally(() => setRefreshing(false));
  };

  const handleEdit = (item: Availability) => {
    setSelectedItem(item);
    setStatus(item.status ? 'confirmed' : 'not confirmed');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (selectedItem) {
      try {
        await axios.put(`http://${URL}:3012/api/availability/${selectedItem._id}`, {
          ...selectedItem,
          status: status === 'confirmed'
        });
        fetchAvailability(); // Refresh the list
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating availability:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedItem) {
      try {
        await axios.delete(`http://${URL}:3012/api/availability/${selectedItem._id}`);
        fetchAvailability(); // Refresh the list
        setModalVisible(false);
      } catch (error) {
        console.error('Error deleting availability:', error);
      }
    }
  };

  const renderAvailability = ({ item }: { item: Availability }) => {
    const doctorData = doctorInfo[item.personnelId];
    const backgroundColor = item.status ? '#D4EDDA' : '#F8D7DA'; // Green for confirmed, red for not confirmed

    return (
      <TouchableOpacity onPress={() => handleEdit(item)}>
        <View style={[styles.availabilityContainer, { backgroundColor }]}>
          <Text style={styles.availabilityText}>Name: {doctorData ? doctorData.Name : 'Loading...'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0057D9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchAvailability} color="#0057D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Availability</Text>
      {Platform.OS === "web" && (
        <TouchableOpacity style={styles.refreshButton} onPress={fetchAvailability}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={availability}
        renderItem={renderAvailability}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0057D9']}
          />
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>Edit Availability</Text>

                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={selectedItem.Date}
                  editable={false}
                />

                <Text style={styles.label}>Shift</Text>
                <TextInput
                  style={styles.input}
                  value={selectedItem.Shift}
                  editable={false}
                />

                <Text style={styles.label}>Status</Text>
                <Picker
                  selectedValue={status}
                  onValueChange={(itemValue: string) => setStatus(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Confirmed" value="confirmed" />
                  <Picker.Item label="Not Confirmed" value="not confirmed" />
                </Picker>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#0057D9',
    textAlign: 'center',
    marginBottom: 20,
  },
  availabilityContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  availabilityText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: '#0057D9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0057D9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#6C757D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AdminNurs;
