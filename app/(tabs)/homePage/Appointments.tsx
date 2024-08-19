import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import getURL from '@/components/src/URL';
const URL=getURL()

type RootStackParamList = {
  Appointments: { user: { Name: string; FamilyName: string; Adress: string; Tel: string; Email: string; Password: string; Role: string; Specialite: string; _id: string } };
  Hospitalization: { Hospitalization: { appointment: Appointment; Docter: { Name: string; FamilyName: string; Adress: string; Tel: string; Email: string; Password: string; Role: string; Specialite: string; _id: string } } };
};

type AppointmentsRouteProp = RouteProp<RootStackParamList, 'Appointments'>;
type AppointmentsNavigationProp = StackNavigationProp<RootStackParamList, 'Appointments'>;

interface AppointmentsProps {
  route: AppointmentsRouteProp;
  navigation: AppointmentsNavigationProp;
}

interface Appointment {
  _id: string;
  idDoctor: string;
  idClient: string;
  jour: Date;
  heure: Date;
  sujet: string;
  Status: string;
}

const Appointments: React.FC<AppointmentsProps> = ({ route, navigation }) => {
  const { user } = route.params;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Appointment[]>(`http://${URL}:3004/api/appointments/get`, {
        params: { clientID: user._id, Role: user.Role }
      });
      const filteredAppointments = response.data.filter(appointment => appointment.Status === "Confirmed");
      setAppointments(filteredAppointments);
      setLoading(false);
    } catch (error) {
      setError('Error fetching appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user._id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const RvDetails = (item: Appointment) => {
    const Hospitalization = {
      appointment: item,
      Docter: user
    };
    
    navigation.navigate('Hospitalization', { Hospitalization });
  };

  return (
    <View style={styles.container}>
      <Button title="Refresh Appointments" onPress={fetchAppointments} color="#007bff" />
      <Text style={styles.header}>Confirmed Appointments for Dr. {user.FamilyName}, {user.Name}</Text>
      {appointments.length === 0 ? (
        <Text style={styles.emptyMessage}>No confirmed appointments available.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id} 
          renderItem={({ item }) => (
            <View style={styles.appointmentContainer}>
              <Text style={styles.appointmentText}>Date: {new Date(item.jour).toDateString()}</Text>
              <Text style={styles.appointmentText}>Time: {new Date(item.heure).toLocaleTimeString()}</Text>
              <Text style={styles.appointmentText}>Reason: {item.sujet}</Text>
              <Button
                title="Create Medical Record"
                onPress={() => RvDetails(item)}
                color="#ff0000"
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0F7FA', // Light blue background color
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff', // Light blue color for the header
  },
  appointmentContainer: {
    padding: 15,
    marginVertical: 10,
    borderColor: '#007bff', // Light blue border color
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff', // White background for appointments
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  appointmentText: {
    fontSize: 16,
    color: '#212529', // Dark color for text
    marginBottom: 5,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#007bff', // Light blue color for empty message
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545', // Red color for error messages
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Appointments;
