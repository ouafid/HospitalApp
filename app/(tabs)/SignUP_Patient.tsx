import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import Name from '@/components/src/Patient/Sign_Up/Name';
import FamilyName from '@/components/src/Patient/Sign_Up/FamilyName';
import Email from '@/components/src/Patient/Sign_Up/Email';
import Adress from '@/components/src/Patient/Sign_Up/Adress';
import Tel from '@/components/src/Patient/Sign_Up/Tel';
import PassWord from '@/components/src/Patient/Sign_Up/Password';
import Confirmation from '@/components/src/Patient/Sign_Up/Confirmation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './_layout';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; 
import getURL from '@/components/src/URL';
const URL=getURL()


// const URL = '192.168.65.59';

type SignUP_DocterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUP_Docter'>;

const SignUP_Patient: React.FC = () => {
  const navigation = useNavigation<SignUP_DocterScreenNavigationProp>();

  const [inputstate, setinputstate] = useState({
    name: '',
    familyName: '',
    email: '',
    tel: '',
    adress: '',
    password: '',
    confirmation: ''
  });

  const [showValidation, setshowvalidation] = useState({
    name: false,
    familyName: false,
    email: false,
    tel: false,
    adress: false,
    password: false,
    confirmation: false
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const validateFields = () => {
    const validationStatus = {
      name: inputstate.name.length >= 3 && inputstate.name.length <= 64,
      familyName: inputstate.familyName.length >= 3 && inputstate.familyName.length <= 64,
      email: inputstate.email.length > 0,
      tel: inputstate.tel.length > 0,
      adress: inputstate.adress.length > 0,
      password: inputstate.password.length >= 6 && /\d/.test(inputstate.password),
      confirmation: inputstate.password === inputstate.confirmation,
    };

    setshowvalidation({
      name: !validationStatus.name,
      familyName: !validationStatus.familyName,
      email: !validationStatus.email,
      tel: !validationStatus.tel,
      adress: !validationStatus.adress,
      password: !validationStatus.password,
      confirmation: !validationStatus.confirmation,
    });

    return Object.values(validationStatus).every(status => status);
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      const nouvelUtilisateur = {
        Name: inputstate.name,
        FamilyName: inputstate.familyName,
        Email: inputstate.email,
        Tel: inputstate.tel,
        Adress: inputstate.adress,
        Password: inputstate.password,
      };

      try {
        const response = await axios.post(`http://${URL}:3000/api/clients/register`, nouvelUtilisateur);
        const data = response.data;
        console.log(data);
        Alert.alert('Nouveau Utilisateur', JSON.stringify(data, null, 2));
        setSuccessMessage("Account created successfully.");
        Alert.alert("Your account has been created");
        navigation.navigate('SignIn_Patient');
      } catch (error) {
        setServerError("An error occurred. Please try again.");
      }
    } else {
      setServerError("Please fill in all fields correctly.");
    }
  };

  return (
    <ScrollView contentContainerStyle={(Platform.OS === "web" ? commonStyles.scrollContainerWeb : commonStyles.scrollContainer)}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Create Account</Text>
        {successMessage && <Text style={commonStyles.successMessage}>{successMessage}</Text>}
        {serverError && <Text style={commonStyles.errorText}>{serverError}</Text>}
        <View style={commonStyles.form}>
          <Name inputstate={inputstate} setinputstate={setinputstate} showValidation={showValidation} />
          <FamilyName inputstate={inputstate} setinputstate={setinputstate} showValidation={showValidation} />
          <Email inputstate={inputstate} setinputstate={setinputstate} />
          <Adress inputstate={inputstate} setinputstate={setinputstate} />
          <Tel inputstate={inputstate} setinputstate={setinputstate} />
          <PassWord inputstate={inputstate} setinputstate={setinputstate} showValidation={showValidation} />
          <Confirmation inputstate={inputstate} setinputstate={setinputstate} showValidation={showValidation} />
        </View>
        <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
          <Text style={commonStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.signupButton} onPress={() => { navigation.navigate('SignIn_Patient') }}>
          <Text style={commonStyles.buttonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const commonStyles = StyleSheet.create({
  scrollContainerWeb: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    position: 'absolute',
    top: 250,
    left: 0,
    right: 0,
    bottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5', // Light gray background for a clean, professional look
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
    color: '#FF4C4C',
    backgroundColor: '#FFE5E5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20, // Moved error message to the top
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#FF4C4C',
  },
  successMessage: {
    color: '#28A745',
    marginBottom: 20, // Moved success message to the top
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
});

export default SignUP_Patient;
