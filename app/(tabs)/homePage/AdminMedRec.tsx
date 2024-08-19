import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, Modal, Button, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import axios, { AxiosError } from 'axios';
import getURL from '@/components/src/URL';

const URL = getURL();

interface MedicalRecord {
  _id: string;
  idDoctor: string;
  idClient: string;
  description: string;
  prescription: string;
  facture: number;
  hospitalisation: boolean;
}

interface Doctor {
  Name: string;
  FamilyName: string;
}

interface Client {
  Name: string;
  FamilyName: string;
}

const AdminMedRec = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<{ [key: string]: Doctor | null }>({});
  const [clientInfo, setClientInfo] = useState<{ [key: string]: Client | null }>({});
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const recordsResponse = await axios.get<MedicalRecord[]>(`http://${URL}:3003/api/medical-records/all`);
      setMedicalRecords(recordsResponse.data);
  
      const uniqueDoctorIds = [...new Set(recordsResponse.data.map(record => record.idDoctor))];
      const uniqueClientIds = [...new Set(recordsResponse.data.map(record => record.idClient))];
  
      await Promise.all(uniqueDoctorIds.map(async (id) => {
        try {
          const doctorResponse = await axios.get<Doctor>(`http://${URL}:3002/api/doctors/profile/${id}`);
          setDoctorInfo(prevState => ({
            ...prevState,
            [id]: doctorResponse.data
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            setDoctorInfo(prevState => ({
              ...prevState,
              [id]: null
            }));
          } else {
            console.error('Error fetching doctor info:', error);
          }
        }
      }));
  
      await Promise.all(uniqueClientIds.map(async (id) => {
        try {
          const clientResponse = await axios.get<Client>(`http://${URL}:3000/api/clients/profile/${id}`);
          setClientInfo(prevState => ({
            ...prevState,
            [id]: clientResponse.data
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            setClientInfo(prevState => ({
              ...prevState,
              [id]: null
            }));
          } else {
            console.error('Error fetching client info:', error);
          }
        }
      }));
    } catch (error) {
      const axiosError = error as AxiosError;
      setError('Error fetching medical records');
      Alert.alert('Error', 'Failed to fetch medical records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const handleRecordPress = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (selectedRecord) {
      try {
        await axios.delete(`http://${URL}:3003/api/medical-records/${selectedRecord._id}`);
        Alert.alert('Success', 'Medical record deleted successfully');
        setModalVisible(false);
        fetchMedicalRecords(); // Refresh the list after deletion
      } catch (error) {
        const axiosError = error as AxiosError;
        Alert.alert('Error', 'Failed to delete medical record');
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMedicalRecords();
  };

  const renderRecord = ({ item }: { item: MedicalRecord }) => {
    const doctor = doctorInfo[item.idDoctor];
    const client = clientInfo[item.idClient];

    return (
      <TouchableOpacity onPress={() => handleRecordPress(item)}>
        <View style={[
          styles.recordContainer,
          item.hospitalisation ? styles.hospitalisationTrue : styles.hospitalisationFalse
        ]}>
          <Text style={[styles.recordText, !doctor ? styles.deletedText : undefined]}>
            Doctor: {doctor ? `${doctor.Name} ${doctor.FamilyName}` : 'Doctor has been deleted'}
          </Text>
          <Text style={[styles.recordText, !client ? styles.deletedText : undefined]}>
            Client: {client ? `${client.Name} ${client.FamilyName}` : 'Client has been deleted'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Records</Text>
      {Platform.OS === "web" && (
        <Button title="Refresh" onPress={fetchMedicalRecords} color="#0057D9" />
      )}
      <FlatList
        data={medicalRecords}
        renderItem={renderRecord}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0057D9']} />
        }
      />
      {selectedRecord && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Medical Record Details</Text>
            <Text style={styles.recordText}>Doctor: {doctorInfo[selectedRecord.idDoctor]?.Name || ''} {doctorInfo[selectedRecord.idDoctor]?.FamilyName || ''}</Text>
            <Text style={styles.recordText}>Client: {clientInfo[selectedRecord.idClient]?.Name || ''} {clientInfo[selectedRecord.idClient]?.FamilyName || ''}</Text>
            <Text style={styles.recordText}>Description: {selectedRecord.description}</Text>
            <Text style={styles.recordText}>Prescription: {selectedRecord.prescription}</Text>
            <Text style={styles.recordText}>Facture: {selectedRecord.facture}</Text>
            <Text style={styles.recordText}>Hospitalisation: {selectedRecord.hospitalisation ? 'Yes' : 'No'}</Text>
            <Button title="Delete Record" onPress={handleDelete} color="#D9534F" />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  recordContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  recordText: {
    fontSize: 16,
    marginBottom: 4,
  },
  deletedText: {
    color: 'red',
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
    color: 'red',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0F7FA',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
  hospitalisationTrue: {
    backgroundColor: '#FFDDDD', // Light red for hospitalisation true
  },
  hospitalisationFalse: {
    backgroundColor: '#DDFFDD', // Light green for hospitalisation false
  },
});

export default AdminMedRec;