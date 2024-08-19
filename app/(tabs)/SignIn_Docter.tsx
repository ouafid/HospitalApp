import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './_layout'; // Assurez-vous d'importer le type RootStackParamList depuis votre fichier _layout.tsx
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import getURL from '@/components/src/URL';
const URL=getURL()

type SignIn_DocterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn_Docter'>;

const SignIn_Docter: React.FC = () => {
  const navigation = useNavigation<SignIn_DocterScreenNavigationProp>();

  const [serverError, setServerError] = useState<string>('');
  const [inputstate, setinputstate] = useState({
    email: '',
    password: '',
  });

  const validateFields = () => {
    if (!inputstate.email || !inputstate.password) {
      setServerError('Please fill in both fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const doctor = {
      Password: inputstate.password,
      Email: inputstate.email
    };

    try {
      const response = await axios.post(`http://${URL}:3002/api/doctors/login`, doctor);
      const data = response.data;
      console.log(data);
      navigation.navigate('_layoutDoc', { user: data });
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setServerError('Doctor not found. Please check your credentials.');
        } else if (status === 401) {
          setServerError('Incorrect password. Please try again.');
        } else {
          setServerError('An error occurred. Please try again.');
        }
      } else if (error.request) {
        setServerError('Connection error. Please check your network connection.');
      } else {
        setServerError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Doctor Sign In</Text>
        {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={inputstate.email}
          onChangeText={(text) => setinputstate(prev => ({ ...prev, email: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={inputstate.password}
          onChangeText={(text) => setinputstate(prev => ({ ...prev, password: text }))}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={() => { navigation.navigate('SignUP_Docter') }}>
          <Text style={styles.buttonText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Removed backgroundColor property
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007BFF', // Title color
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#6C757D',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4C4C', // Red color for error messages
    backgroundColor: '#FFE5E5', // Light pink background for error messages
    borderRadius: 5,
    padding: 10,
    marginBottom: 15, // Spacing between error message and form
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#FF4C4C', // Red border for error messages
  },
});

export default SignIn_Docter;
