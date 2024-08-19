import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Picker, Button, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const RoomsScreen: React.FC = () => {
  const [rooms, setRooms] = useState<Array<{ Number: number, BedsNumber: number, _id: string }>>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/rooms');
        setRooms(response.data);
      } catch (error) {
        setError('Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleArrivalDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowArrivalDatePicker(Platform.OS === 'ios');
    if (selectedDate) setArrivalDate(selectedDate);
  };

  const handleDepartureDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDepartureDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDepartureDate(selectedDate);
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Select a Room:</Text>
      <Picker
        selectedValue={selectedRoom}
        onValueChange={(itemValue) => setSelectedRoom(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a room" value="" />
        {rooms.map((room) => (
          <Picker.Item
            key={room._id}
            label={`Room ${room.Number} with ${room.BedsNumber} beds`}
            value={room._id}
          />
        ))}
      </Picker>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Arrival Date:</Text>
        <Button title="Select Arrival Date" onPress={() => setShowArrivalDatePicker(true)} />
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Departure Date:</Text>
        <Button title="Select Departure Date" onPress={() => setShowDepartureDatePicker(true)} />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default RoomsScreen;
