import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Button, Modal, TextInput, Alert, RefreshControl, Platform } from 'react-native';
import axios from 'axios';
import getURL from '@/components/src/URL';

const URL = getURL();

interface Room {
  _id: string;
  Number: number;
  BedsNumber: number;
  Occupied: number;
}

const AdminBeds = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<{ Number: number; BedsNumber: number }>({ Number: 0, BedsNumber: 0 });
  const [refreshing, setRefreshing] = useState(false);

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Room[]>(`http://${URL}:3010/api/rooms`);
      setRooms(response.data);
    } catch (error) {
      setError('Error fetching rooms');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  // Add a room
  const addRoom = async () => {
    try {
      await axios.post(`http://${URL}:3010/api/rooms/add`, newRoom);
      if (Platform.OS === 'web') {
        alert('Room added successfully');
      } else {
        Alert.alert('Success', 'Room added successfully');
      }
      setAddModalVisible(false);
      fetchRooms();
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            errorMessage = 'Room number already exists';
          } else {
            errorMessage = 'Failed to add room';
          }
        }
      }
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      console.error(error);
    }
  };

  // Update a room
  const updateRoom = async () => {
    if (!currentRoom) return;

    try {
      await axios.put(`http://${URL}:3010/api/rooms/update`, {
        selectedRoomId: currentRoom._id, // Ensure you send the correct ID
        BedsNumber: currentRoom.BedsNumber,
        Occupied: currentRoom.Occupied // Include Occupied in the update
      });

      if (Platform.OS === 'web') {
        alert('Room updated successfully');
      } else {
        Alert.alert('Success', 'Room updated successfully');
      }
      setUpdateModalVisible(false);
      fetchRooms();
    } catch (error: unknown) {
      const errorMessage = 'Failed to update room';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      console.error('Error updating room:', error);
    }
  };

  // Delete a room
  const deleteRoom = async (roomId: string) => {
    try {
      await axios.delete(`http://${URL}:3010/api/rooms/${roomId}`);
      if (Platform.OS === 'web') {
        alert('Room deleted successfully');
      } else {
        Alert.alert('Success', 'Room deleted successfully');
      }
      fetchRooms();
    } catch (error: unknown) {
      const errorMessage = 'Failed to delete room';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const renderRoom = ({ item }: { item: Room }) => (
    <View style={styles.roomContainer}>
      <Text style={styles.roomText}>Room Number: {item.Number}</Text>
      <Text style={styles.roomText}>Beds Available: {item.BedsNumber}</Text>
      <Text style={styles.roomText}>Beds Occupied: {item.Occupied}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Update Beds" onPress={() => {
          setCurrentRoom(item);
          setUpdateModalVisible(true);
        }} color="#0057D9" />
        <Button title="Delete Room" onPress={() => deleteRoom(item._id)} color="#D9534F" />
      </View>
    </View>
  );

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
      <Text style={styles.title}>Manage Rooms</Text>
      {Platform.OS === "web" && (
        <Button title="Refresh" onPress={onRefresh} color="#0057D9" />
      )}
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0057D9']} />}
      />
      <Button title="Add New Room" onPress={() => setAddModalVisible(true)} color="#0057D9" />

      {/* Modal for Adding a Room */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Room</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Room Number"
            onChangeText={(text) => setNewRoom({ ...newRoom, Number: Number(text) })}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Beds Number"
            onChangeText={(text) => setNewRoom({ ...newRoom, BedsNumber: Number(text) })}
          />
          <Button title="Add Room" onPress={addRoom} color="#0057D9" />
          <Button title="Close" onPress={() => setAddModalVisible(false)} color="#D9534F" />
        </View>
      </Modal>

      {/* Modal for Updating a Room */}
      <Modal
        visible={updateModalVisible}
        animationType="slide"
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Room</Text>
          {currentRoom && (
            <>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="New Beds Number"
                onChangeText={(text) => setCurrentRoom({ ...currentRoom, BedsNumber: Number(text) })}
                value={currentRoom.BedsNumber.toString()}
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Occupied Beds"
                onChangeText={(text) => setCurrentRoom({ ...currentRoom, Occupied: Number(text) })}
                value={currentRoom.Occupied.toString()}
              />
            </>
          )}
          <Button title="Update Room" onPress={updateRoom} color="#0057D9" />
          <Button title="Close" onPress={() => setUpdateModalVisible(false)} color="#D9534F" />
        </View>
      </Modal>
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
  roomContainer: {
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
  roomText: {
    fontSize: 16,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#007BFF',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
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
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 20,
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
    fontSize: 18,
    color: 'red',
  },
});

export default AdminBeds;
