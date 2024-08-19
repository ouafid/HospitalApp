import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import getURL from '@/components/src/URL';
const URL=getURL()

type RootStackParamList = {
  HomePat: { user: { Name: string; FamilyName: string; Adress: string; Tel: string; Email: string; Password: string; Role: string; Specialite: string; _id: string } };
};

type HomePatRouteProp = RouteProp<RootStackParamList, 'HomePat'>;
type HomePatNavigationProp = StackNavigationProp<RootStackParamList, 'HomePat'>;

interface HomePatProps {
  route: HomePatRouteProp;
  navigation: HomePatNavigationProp;
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

const HomePat: React.FC<HomePatProps> = ({ route, navigation }) => {
  const { user } = route.params;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<{ [key: string]: any }>({});

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Appointment[]>(`http://${URL}:3004/api/appointments/get`, {
        params: { clientID: user._id }
      });
      setAppointments(response.data);

      const doctorIds = response.data.map((appointment) => appointment.idDoctor);
      const uniqueDoctorIds = [...new Set(doctorIds)];

      await Promise.all(uniqueDoctorIds.map(async (id) => {
        try {
          const doctorResponse = await axios.get(`http://${URL}:3002/api/doctors/profile/${id}`);
          setDoctorInfo((prevState) => ({
            ...prevState,
            [id]: doctorResponse.data
          }));
        } catch (error) {
          console.error('Error fetching doctor info:', error);
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
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const getStatusContainerStyle = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return styles.confirmedContainer;
      case 'Pending':
        return styles.pendingContainer;
      default:
        return styles.notConfirmedContainer;
    }
  };

  const renderItem = ({ item }: { item: Appointment }) => {
    const doctorData = doctorInfo[item.idDoctor];
    return (
      <View style={[styles.appointmentContainer, getStatusContainerStyle(item.Status)]}>
        <Text style={styles.appointmentText}>Date: {new Date(item.jour).toDateString()}</Text>
        <Text style={styles.appointmentText}>Time: {new Date(item.heure).toLocaleTimeString()}</Text>
        <Text style={styles.appointmentText}>Subject: {item.sujet}</Text>
        <Text style={styles.appointmentText}>with Dr: {doctorData ? doctorData.FamilyName : 'Loading..'}</Text>
        <Text style={styles.appointmentText}>Status: {item.Status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {appointments.length > 0 && (
        <View>
          <Button title="Refresh" onPress={fetchAppointments} color="#007BFF" />
          <Text style={styles.header}>Appointments for: {user.FamilyName}, {user.Name}</Text>
        </View>
      )}
      {appointments.length === 0 ? (
        <View style={styles.noAppointmentsContainer}>
          <Text style={styles.noAppointmentsText}>No appointments available.</Text>
          <Button title="Refresh" onPress={fetchAppointments} color="#007BFF" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0F7FA', // Light gray background for the entire page
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker text color for the header
  },
  appointmentContainer: {
    padding: 15,
    marginVertical: 10,
    borderColor: '#CCC', // Light gray border
    borderWidth: 1,
    borderRadius: 5,
  },
  appointmentText: {
    fontSize: 16, // Slightly larger font size for readability
  },
  confirmedContainer: {
    backgroundColor: '#D4EDDA', // Light green for confirmed
  },
  pendingContainer: {
    backgroundColor: '#FFF3CD', // Light yellow for pending
  },
  notConfirmedContainer: {
    backgroundColor: '#F8D7DA', // Light red for not confirmed
  },
  noAppointmentsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noAppointmentsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF', // Blue color for the message
    marginBottom: 20,
  },
  errorText: {
    color: '#FF4C4C', // Red color for error messages
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePat;
