import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Button, RefreshControl, Platform, Modal, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import getURL from '@/components/src/URL';
const URL = getURL();

interface Doctor {
  _id: number;
  Name: string;
  FamilyName: string;
  Email: string;
  Role: string;
  Specialite: string;
  Tel: string;
}

const AdminDoc = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Doctor[]>(`http://${URL}:3002/api/doctors/all`);
      setDoctors(response.data);
    } catch (error) {
      setError('Error fetching doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDoctorPress = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (selectedDoctor) {
      try {
        await axios.put(`http://${URL}:3002/api/doctors/profile/${selectedDoctor._id}`, selectedDoctor);
        Alert.alert('Success', 'Doctor information updated successfully');
        setModalVisible(false);
        fetchDoctors(); // Refresh the list after update
      } catch (error) {
        Alert.alert('Error', 'Failed to update doctor information');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedDoctor) {
      try {
        await axios.delete(`http://${URL}:3002/api/doctors/${selectedDoctor._id}`);
        Alert.alert('Success', 'Doctor deleted successfully');
        setModalVisible(false);
        fetchDoctors(); // Refresh the list after deletion
      } catch (error) {
        Alert.alert('Error', 'Failed to delete doctor');
      }
    }
  };

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <TouchableOpacity onPress={() => handleDoctorPress(item)}>
      <View style={styles.doctorContainer}>
        <Text style={styles.name}>{item.Name} {item.FamilyName}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Button title="Retry" onPress={fetchDoctors} color="#0057D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctors</Text>
      {Platform.OS === "web" && (
        <Button title="Refresh" onPress={fetchDoctors} color="#0057D9" />
      )}
      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchDoctors} colors={['#0057D9']} />
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
          {selectedDoctor && (
            <>
              <Text style={styles.modalTitle}>Edit Doctor</Text>
              
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={selectedDoctor.Name}
                onChangeText={(text) => setSelectedDoctor({ ...selectedDoctor, Name: text })}
                placeholder="Name"
                placeholderTextColor="#888"
              />
              
              <Text style={styles.label}>Family Name</Text>
              <TextInput
                style={styles.input}
                value={selectedDoctor.FamilyName}
                onChangeText={(text) => setSelectedDoctor({ ...selectedDoctor, FamilyName: text })}
                placeholder="Family Name"
                placeholderTextColor="#888"
              />
              
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={selectedDoctor.Email}
                onChangeText={(text) => setSelectedDoctor({ ...selectedDoctor, Email: text })}
                placeholder="Email"
                placeholderTextColor="#888"
              />
              
              <Text style={styles.label}>Role</Text>
              <TextInput
                style={styles.input}
                value={selectedDoctor.Role}
                onChangeText={(text) => setSelectedDoctor({ ...selectedDoctor, Role: text })}
                placeholder="Role"
                placeholderTextColor="#888"
              />
              
              <Text style={styles.label}>Specialty</Text>
              <TextInput
                style={styles.input}
                value={selectedDoctor.Specialite}
                onChangeText={(text) => setSelectedDoctor({ ...selectedDoctor, Specialite: text })}
                placeholder="Specialty"
                placeholderTextColor="#888"
              />
              
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={selectedDoctor.Tel}
                onChangeText={(text) => setSelectedDoctor({ ...selectedDoctor, Tel: text })}
                placeholder="Phone"
                placeholderTextColor="#888"
              />

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

export default AdminDoc;

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
  doctorContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
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
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0057D9',
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#F4F6F8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#0057D9',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#AAAAAA',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
