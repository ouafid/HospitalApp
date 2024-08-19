import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button, TextInput, Platform, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import getURL from '@/components/src/URL';
const URL=getURL()


type RootStackParamList = {
  RV: { user: { Name: string, FamilyName: string, Adress: string, Tel: string, Email: string, Password: string, Role: string, Specialite: string, _id: string } };
};

type RVRouteProp = RouteProp<RootStackParamList, 'RV'>;
type RVNavigationProp = StackNavigationProp<RootStackParamList, 'RV'>;

interface RVProps {
  route: RVRouteProp;
  navigation: RVNavigationProp;
}

interface Doctor {
  _id: string;
  Name: string;
  FamilyName: string;
  Specialite: string;
  Tel: string;
  Email: string;
}

const RV: React.FC<RVProps> = ({ route, navigation }) => {
  const { user } = route.params;
  const [serverError, setServerError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Doctor[]>(`http://${URL}:3002/api/doctors/all`);
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching doctors');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      const doctor = doctors.find(doc => doc._id === selectedDoctorId);
      setSelectedDoctor(doctor || null);
    }
  }, [selectedDoctorId, doctors]);

  useEffect(() => {
    if (serverError) {
      Alert.alert('Error', serverError);
    }
  }, [serverError]);

  useEffect(() => {
    if (successMessage) {
      Alert.alert('Success', successMessage);
    }
  }, [successMessage]);

  const handleRefresh = () => {
    fetchDoctors();
  };

  const validateDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    return date >= today;
  };

  const validateTime = (time: Date) => {
    const hours = time.getHours();
    return hours >= 9 && hours <= 18;
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    if (validateDate(currentDate)) {
      setShowDatePicker(Platform.OS === 'ios');
      setDate(currentDate);
    } else {
      Alert.alert('Invalid Date', 'You cannot select a date in the past.');
    }
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time;
    if (validateTime(currentTime)) {
      setShowTimePicker(Platform.OS === 'ios');
      setTime(currentTime);
    } else {
      Alert.alert('Invalid Time', 'Please select a time between 9 AM and 6 PM.');
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    if (validateDate(newDate)) {
      setDate(newDate);
    } else {
      alert('You cannot select a date in the past.');
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(':').map(Number);
    const newTime = new Date(time);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    if (validateTime(newTime)) {
      setTime(newTime);
    } else {
      alert('Please select a time between 9 AM and 6 PM.');
    }
  };

  const handleSubmit = async () => {
    if (selectedDoctorId && date && time && reason) {
      const appointment = {
        idDoctor: selectedDoctorId,
        idClient: user._id,
        jour: date,
        heure: time,
        sujet: reason,
        Status: "not Confirmed"
      };

      try {
        const response = await axios.post(`http://${URL}:3004/api/appointments/create`, appointment);
        const data = response.data;
        setSuccessMessage('Appointment successfully created!');
        console.log(data);
      } catch (error) {
        setServerError("Une erreur est survenue. Veuillez réessayer.");
      }
    } else {
      console.log('Please fill out all fields');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}> APPOINTMENT </Text>
      <Text style={{ color: "red",fontSize:25,marginBottom:20 }}>You need to fill all the fields</Text>
      <Text style={styles.label}>Select a Doctor:</Text>
      <Picker
        selectedValue={selectedDoctorId}
        onValueChange={(itemValue) => setSelectedDoctorId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a doctor" value="" />
        {doctors.map((doctor) => (
          <Picker.Item
            key={doctor._id}
            label={`${doctor.Name} ${doctor.FamilyName} (${doctor.Specialite})`}
            value={doctor._id}
          />
        ))}
      </Picker>

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh Doctors</Text>
      </TouchableOpacity>

      {selectedDoctor && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Phone: {selectedDoctor.Tel}</Text>
          <Text style={styles.detailsText}>Email: {selectedDoctor.Email}</Text>
        </View>
      )}

      {Platform.OS === 'web' && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date:</Text>
            <input
              type="date"
              value={date.toISOString().split('T')[0]}
              onChange={handleDateChange}
              style={styles.picker}
            />
            <Text>{date.toDateString()}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time:</Text>
            <input
              type="time"
              value={time.toTimeString().slice(0, 5)}
              onChange={handleTimeChange}
              style={styles.picker}
            />
            <Text>{time.toLocaleTimeString()}</Text>
          </View>
        </>
      )}

      {(Platform.OS === 'android' || Platform.OS === 'ios') && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date:</Text>
            <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <Text>{date.toDateString()}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time:</Text>
            <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={time}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
            <Text>{time.toLocaleTimeString()}</Text>
          </View>
        </>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Reason for Visit:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter reason here"
          value={reason}
          onChangeText={setReason}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {serverError && <Text style={styles.errorText}>{serverError}</Text>}
      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    
    textAlign:"center",
    marginTop:70,
    marginBottom:20
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#E0F7FA', // Light blue background color
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  refreshButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  refreshButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginTop: 20,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RV;
