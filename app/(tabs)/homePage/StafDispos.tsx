import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RouteProp } from '@react-navigation/native';
import getURL from '@/components/src/URL';
import axios from 'axios';
const URL = getURL()

type RootTabParamList = {
    StafDispos: { user: { FamilyName: string; Name: string; Email: string; Role: string, _id: string } };
};

type StafDisposRouteProp = RouteProp<RootTabParamList, 'StafDispos'>;

interface StafDisposProps {
    route: StafDisposRouteProp;
}

const StafDispos: React.FC<StafDisposProps> = ({ route }) => {
    const { user } = route.params;
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [selectedShift, setSelectedShift] = useState<string>('');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shifts = [
        { label: 'Night  (00:00 - 08:00)', value: 'Night' },
        { label: 'Morning  (08:00 - 16:00)', value: 'Morning' },
        { label: 'Afternoon  (16:00 - 24:00)', value: 'Afternoon' }
    ];

    const handleSubmit = async () => {
        // Ensure selectedDay and selectedShift are not empty
        if (!selectedDay || !selectedShift) {
            alert('Please select both a day and a shift.');
            return;
        }
    
        try {
            // Replace 'personnelId' with the actual ID you need to send
            const availability = {
                personnelId: user._id,
                Date: selectedDay,
                Shift: selectedShift,
                status: false
            };
    
            // Send POST request to add availability
            const response = await axios.post(`http://${URL}:3012/api/availability/add`, availability);
    
            // Check if the response status is OK (status code 200-299)
            if (response.status >= 200 && response.status < 300) {
                console.log('Availability successfully added:', response.data);
                alert('Availability successfully added!');
            } else {
                throw new Error('Failed to add availability');
            }
        } catch (error) {
            console.error('Error adding availability:', error);
            alert('Error adding availability');
        }
    };
    



    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Select Availability for {user.Name} {user.FamilyName}
            </Text>

            <Text style={styles.label}>Day of the Week</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedDay}
                    onValueChange={(itemValue: string) => setSelectedDay(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a day" value="" />
                    {daysOfWeek.map((day) => (
                        <Picker.Item key={day} label={day} value={day} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Shift</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedShift}
                    onValueChange={(itemValue: string) => setSelectedShift(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a shift" value="" />
                    {shifts.map((shift) => (
                        <Picker.Item key={shift.value} label={shift.label} value={shift.value} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

export default StafDispos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        color: '#0D47A1',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        color: '#0D47A1',
        marginBottom: 10,
        textAlign: 'left',
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#0D47A1',
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#0D47A1',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
});
