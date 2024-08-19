import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Platform, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../_layout'; // Assurez-vous que ce chemin est correct
import getURL from '@/components/src/URL';
const URL=getURL()

type AppointmentsNavigationProp = StackNavigationProp<RootStackParamList, "_layoutDoc">;

interface HospitalizationProps {
  route: any;
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

interface Room {
  Number: number;
  BedsNumber: number;
  Occupied:number;
  _id: string;
}

const Hospitalization: React.FC<HospitalizationProps> = ({ route, navigation }) => {
  const { Hospitalization } = route.params;
  const { appointment, Docter } = Hospitalization;
  const [prescription, setPrescription] = useState('');
  const [invoice, setInvoice] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showRooms, setShowRooms] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [bedNumber, setBedNumber] = useState('');
  const [Occupied, setOccupied] = useState('');
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);

  useEffect(() => {
    if (showRooms) {
      const fetchRooms = async () => {
        setLoading(true);
        try {
          console.log('Fetching rooms...');
          const response = await axios.get(`http://${URL}:3010/api/rooms`);
          // console.log('Rooms fetched:', response.data);
          setRooms(response.data);
        } catch (error) {
          console.error('Error fetching rooms:', error);
          setError('Failed to fetch rooms');
        } finally {
          setLoading(false);
        }
      };

      fetchRooms();
    }
  }, [showRooms]);

  const handleCreateMedicalRecord = async () => {
    const Confirmation = {
      idDoctor: appointment.idDoctor,
      idClient: appointment.idClient,
      description: appointment.sujet,
      prescription,
      facture: invoice,
      hospitalisation:false

    };

    try {
      await axios.post(`http://${URL}:3003/api/medical-records/noauth`, Confirmation);
      setSuccessMessage('Medical record created successfully!');

      // Wait for 2 seconds before navigating
      setTimeout(() => {
        navigation.navigate("_layoutDoc", { user: Docter });
      }, 2000);

      await DeleteRVById(appointment);
    } catch (error) {
      console.error('Something went wrong:', error);
      setSuccessMessage('Failed to create medical record.');
    }
  };


  const handleHospitalization = () => {
    setShowRooms(true);
  };

const handleSubmit = async () => {
  const assignBed = {
    idDoctor: appointment.idDoctor,
    idCoctor: appointment.idDoctor,
    chambre: selectedRoomId,
    numLit: bedNumber,
    arrivee: arrivalDate,
    depart: departureDate,
    occupied: true
  };
  const Confirmation = {
    idDoctor: appointment.idDoctor,
    idClient: appointment.idClient,
    description: appointment.sujet,
    prescription,
    facture: invoice,
    hospitalisation:true

  };

  try {
    // create Medical Record
    const MedRecResponse = await axios.post(`http://${URL}:3003/api/medical-records/noauth`, Confirmation);
    // Assign bed
    const bedResponse = await axios.post(`http://${URL}:3005/api/beds`, assignBed);
    
    if (bedResponse) {
      

      // Update room occupancy
      const bedUpdateResponse = await axios.put(`http://${URL}:3010/api/rooms/updateOccupied`, { selectedRoomId, Occupied });
      
      if (bedUpdateResponse) {
        await DeleteRVById(appointment);
        setSuccessMessage('The bed has been assigned successfully!');
        
        // Wait for 2 seconds before navigating
        setTimeout(() => {
          navigation.navigate("_layoutDoc", { user: Docter });
        }, 2000);
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      if (error.response) {
        // Check for specific error messages
        if (error.response.data.error === 'No beds available') {
          setSuccessMessage('No beds available');
        } else {
          setSuccessMessage('Failed to assign bed.');
        }
      } else {
        // Handle other Axios errors
        console.error('Axios error:', error.message);
        setSuccessMessage('Failed to assign bed.');
      }
    } else if (error instanceof Error) {
      // Handle generic error
      console.error('Error:', error.message);
      setSuccessMessage('Failed to assign bed.');
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      setSuccessMessage('Failed to assign bed.');
    }
  }
};

  

  const handleArrivalDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowArrivalDatePicker(Platform.OS === 'ios');
    if (selectedDate) setArrivalDate(selectedDate);
  };

  const handleDepartureDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDepartureDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDepartureDate(selectedDate);
  };

  const DeleteRVById = async (appointment: Appointment) => {
    try {
      setLoading(true);
      const appointmentId = appointment._id;
      await axios.post(`http://${URL}:3004/api/appointments/delete`, { appointmentId });
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {showRooms ? (
          <View style={styles.innerContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>


            ) : (
              <>
              <Text style={styles.title}> HOSPITALIZATION </Text>
                <Text style={styles.label}>Choose a Room:</Text>
                <Picker
                  selectedValue={selectedRoomId}
                  onValueChange={(value) => setSelectedRoomId(value)}
                  style={pickerSelectStyles.input}
                >
                  {rooms.map(room => (
                    <Picker.Item
                      key={room._id}
                      label={`Room: ${room.Number} - Beds: ${room.BedsNumber} - Beds Dipos: ${room.BedsNumber - room.Occupied}`}
                      value={room._id}
                    />
                  ))}
                </Picker>
                <Text style={styles.label}>How Many Beds:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter bed number"
                  value={Occupied}
                  onChangeText={setOccupied}
                />

                {(Platform.OS === "android" || Platform.OS === "ios") && (
                  <View style={styles.datePickerContainer}>
                    <Text style={styles.label}>Arrival Date:</Text>
                    <Button title="Select Arrival Date" onPress={() => setShowArrivalDatePicker(true)} color="#007BFF" />
                    {showArrivalDatePicker && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={arrivalDate}
                        mode="date"
                        display="default"
                        onChange={handleArrivalDateChange}
                      />
                    )}
                    <Text>{arrivalDate.toDateString()}</Text>
                  </View>
                )}
                {(Platform.OS === "android" || Platform.OS === "ios") && (
                  <View style={styles.datePickerContainer}>
                    <Text style={styles.label}>Departure Date:</Text>
                    <Button title="Select Departure Date" onPress={() => setShowDepartureDatePicker(true)} color="#007BFF" />
                    {showDepartureDatePicker && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={departureDate}
                        mode="date"
                        display="default"
                        onChange={handleDepartureDateChange}
                      />
                    )}
                    <Text>{departureDate.toDateString()}</Text>
                  </View>
                )}

                {/* Web Date Pickers */}
                {Platform.OS === 'web' && (
                  <>
                    <View style={styles.datePickerContainer}>
                      <Text style={styles.label}>Arrival Date:</Text>
                      <input
                        type="date"
                        value={arrivalDate.toISOString().split('T')[0]}
                        onChange={(e) => setArrivalDate(new Date(e.target.value))}
                      />
                    </View>
                    <View style={styles.datePickerContainer}>
                      <Text style={styles.label}>Departure Date:</Text>
                      <input
                        type="date"
                        value={departureDate.toISOString().split('T')[0]}
                        onChange={(e) => setDepartureDate(new Date(e.target.value))}
                      />
                    </View>
                  </>
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button, styles.yellowButton]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}> Confirme Hospitalization</Text>
                  </TouchableOpacity>
                </View>
                {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
              </>
            )}
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <Text style={styles.header}>Create Medical Record</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Doctor:</Text>
              <Text style={styles.value}>{Docter.Name} {Docter.FamilyName}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{new Date(appointment.jour).toDateString()}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Time:</Text>
              <Text style={styles.value}>{new Date(appointment.heure).toLocaleTimeString()}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Reason:</Text>
              <Text style={styles.value}>{appointment.sujet}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter prescription"
              value={prescription}
              onChangeText={setPrescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter invoice"
              value={invoice}
              onChangeText={setInvoice}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleCreateMedicalRecord}>
                <Text style={styles.buttonText}>Create Medical Record</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.yellowButton]} onPress={handleHospitalization}>
                <Text style={styles.buttonText}>Hospitalization</Text>
              </TouchableOpacity>
            </View>
            {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff', // Blue text color
    textAlign:"center",
    marginTop:70,
    marginBottom:20
  },
  container: {
    
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
    textAlign: "center",
    marginTop: 100
  },
  detailsContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  greenButton: {
    backgroundColor: '#28A745',
  },
  yellowButton: {
    backgroundColor: '#FFC107',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  successMessage: {
    color: '#28A745',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: '#DC3545',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  input: {
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default Hospitalization;
