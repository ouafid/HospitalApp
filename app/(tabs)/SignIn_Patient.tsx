import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './_layout'; // Assurez-vous d'importer le type RootStackParamList depuis votre fichier _layout.tsx
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import getURL from '@/components/src/URL';
const URL=getURL()

type SignIn_DocterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn_Docter'>;

const SignIn_Patient: React.FC = () => {
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

    const employe = {
      Password: inputstate.password,
      Email: inputstate.email
    };
    console.log(employe);

    try {
      const response = await axios.post(`http://${URL}:3000/api/clients/login`, employe);
      const data = response.data;
      console.log(data);
      // Redirigez l'utilisateur vers une autre page avec les données de l'utilisateur
      navigation.navigate('_layoutDoc', { user: data });
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setServerError('Client introuvable. Veuillez vérifier vos informations.');
        } else if (status === 401) {
          setServerError('Mot de passe incorrect. Veuillez réessayer.');
        } else {
          setServerError('Une erreur est survenue. Veuillez réessayer.');
        }
      } else if (error.request) {
        setServerError('Erreur de connexion. Veuillez vérifier votre connexion réseau.');
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Patient Sign In</Text>
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
        <TouchableOpacity style={styles.signupButton} onPress={() => { navigation.navigate('SignUP_Patient') }}>
          <Text style={styles.buttonText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Fond plus clair pour un meilleur contraste
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
    color: '#333', // Couleur du texte plus sombre pour le titre
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
    color: '#FF4C4C', // Couleur rouge vif pour les messages d'erreur
    backgroundColor: '#FFE5E5', // Fond légèrement rose pour le contraste
    borderRadius: 5,
    padding: 10,
    marginBottom: 15, // Espacement entre le message d'erreur et le reste du formulaire
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#FF4C4C', // Bordure rouge vif pour plus de visibilité
  },
});

export default SignIn_Patient;
