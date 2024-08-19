import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet, Button } from 'react-native';
import { RouteProp, NavigationProp } from '@react-navigation/native'; // Import required types
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import getURL from '@/components/src/URL';
const URL=getURL()

type RootStackParamList = {
  HomeDoc: { user: { Name: string; FamilyName: string; Adress: string; Tel: string; Email: string; Password: string; Role: string; Specialite: string; _id: string } };
};

type HomeDocRouteProp = RouteProp<RootStackParamList, 'HomeDoc'>;
type HomeDocNavigationProp = StackNavigationProp<RootStackParamList, 'HomeDoc'>;

interface HomeDocProps {
  route: HomeDocRouteProp;
  navigation: HomeDocNavigationProp;
}

interface Appointment {
  _id: string;
  idDoctor: string;
  idClient: string;
  jour: string;
  heure: string;
  sujet: string;
  Status: string;
}



const HomeDoc: React.FC<HomeDocProps> = ({ route, navigation }) => {
  const { user } = route.params;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<{ [key: string]: any }>({});

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Appointment[]>(`http://${URL}:3004/api/appointments/get`, {
        params: { clientID: user._id, Role: user.Role }
      });

      const filteredAppointments = response.data.filter(appointment => appointment.Status !== "Confirmed");
      setAppointments(filteredAppointments);

      const clientIds = filteredAppointments.map((appointment) => appointment.idClient);
      const uniqueClientIds = [...new Set(clientIds)];

      await Promise.all(uniqueClientIds.map(async (id) => {
        try {
          const clientResponse = await axios.get(`http://${URL}:3000/api/clients/profile/${id}`);
          setClientInfo((prevState) => ({
            ...prevState,
            [id]: clientResponse.data
          }));
        } catch (error) {
          console.error('Error fetching client info:', error);
        }
      }));

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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const updateAppointment = async (item: Appointment) => {
    const id = item._id;
    try {
      const response = await axios.post(`http://${URL}:3004/api/appointments/update`, { appointmentId: id });
      console.log('Response:', response.data);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return ( 
    
    <View style={styles.container}>
      {appointments.length > 0 && (
        <View> 
          <Button title="Refresh" onPress={fetchAppointments} color="#007bff" />
        <Text style={styles.header}>To Confirm for Dr: {user.FamilyName}, {user.Name}</Text>
        </View>
      )}
      {appointments.length === 0 ? (
        <View style={styles.noAppointmentsContainer}>
          <Text style={styles.noAppointmentsText}>No appointments available.</Text>
          <Button title="Refresh" onPress={fetchAppointments} color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const clientData = clientInfo[item.idClient];
            return (
              <View style={styles.appointmentContainer}>
                <Text style={styles.appointmentText}>Date: {new Date(item.jour).toDateString()}</Text>
                <Text style={styles.appointmentText}>Time: {new Date(item.heure).toLocaleTimeString()}</Text>
                <Text style={styles.appointmentText}>Reason: {item.sujet}</Text>
                <Text style={styles.appointmentText}>Client: {clientData ? `${clientData.Name} , ${clientData.FamilyName}` : 'Loading..'}</Text>
                <Button
                  title="Confirm"
                  onPress={() => updateAppointment(item)}
                  color="#28a745"
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0F7FA', // Light blue background for the entire page
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  appointmentContainer: {
    padding: 15,
    marginVertical: 10,
    borderColor: '#B0BEC5', // Grey color for borders
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // White background for appointment items
  },
  appointmentText: {
    fontSize: 16,
  },
  noAppointmentsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noAppointmentsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff', // Blue color for the message
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeDoc;
