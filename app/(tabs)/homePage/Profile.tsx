import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import getURL from '@/components/src/URL';
const URL=getURL()

type RootStackParamList = {
  Profile: { user: { _id: string, Name: string; FamilyName: string; Adress: string; Tel: string; Email: string; Password: string; Role: string; Specialite: string } };
};

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileProps {
  route: ProfileRouteProp;
  navigation: ProfileNavigationProp;
}

const Profile: React.FC<ProfileProps> = ({ route }) => {
  const { user } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [fieldToEdit, setFieldToEdit] = useState<string | null>(null);

  const handleEdit = (field: string) => {
    setFieldToEdit(field);
    setModalVisible(true);
  };
  
  const handleSave = async () => {
    if (fieldToEdit) {
      const Position = user.Role === "Docter" ? "doctors" : "clients";
      const Port = user.Role === "Docter" ? "3002" : "3000";
      const apiUrl = `http://${URL}:${Port}/api/${Position}/profile/${user._id}`;
  
      try {
        await axios.put(apiUrl, {
          [fieldToEdit]: editedUser[fieldToEdit as keyof typeof user]
        });
        setEditedUser({ ...editedUser });
        Alert.alert('Saved', `Updated ${fieldToEdit}`);
      } catch (error) {
        console.error("Error saving user data:", error);
        Alert.alert('Error', 'Failed to save changes');
      } finally {
        setModalVisible(false);
      }
    }
  };

  const handleInputChange = (text: string) => {
    setEditedUser({ ...editedUser, [fieldToEdit as string]: text });
  };

  const getInitials = (name: string, familyName: string) => {
    const nameInitial = name.charAt(0).toUpperCase();
    const familyNameInitial = familyName.charAt(0).toUpperCase();
    return `${nameInitial}${familyNameInitial}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImage}>
          <Text style={styles.initials}>{getInitials(user.Name, user.FamilyName)}</Text>
        </View>
        <Text style={styles.name}>{user.Name} {user.FamilyName}</Text>
      </View>
      {user ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.Email}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Email')}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          {(user.Role === 'Docter' || user.Role == "Admin") ? (
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Speciality:</Text>
              <Text style={styles.value}>{user.Specialite}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Specialite')}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{user.Adress}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Adress')}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user.Tel}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit('Tel')}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.error}>No data passed</Text>
      )}

      {/* Modal for Editing */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit {fieldToEdit}</Text>
          <TextInput
            style={styles.textInput}
            value={editedUser[fieldToEdit as keyof typeof user]}
            onChangeText={handleInputChange}
          />
          <Button title="Save" onPress={handleSave} color="#007bff" />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0F7FA', // Light blue background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007bff', // Blue background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  initials: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff', // Blue text color
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 18,
    color: '#555',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E0F7FA', // Light blue background color
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff', // Blue text color
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#007bff', // Blue border
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default Profile;
