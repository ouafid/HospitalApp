import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Platform,Dimensions, Alert } from 'react-native';
import Name from '@/components/src/docter/Sign_Up/Name';
import FamilyName from '@/components/src/docter/Sign_Up/FamilyName';
import Email from '@/components/src/docter/Sign_Up/Email';
import Specialite from '@/components/src/docter/Sign_Up/Specialite';
import Tel from '@/components/src/docter/Sign_Up/Tel';
import PassWord from '@/components/src/docter/Sign_Up/Password';
import Confirmation from '@/components/src/docter/Sign_Up/Confirmation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './_layout';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import getURL from '@/components/src/URL';
const URL=getURL()

type SignUP_DocterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUP_Docter'>;

const SignUP_Docter: React.FC = () => {
  const navigation = useNavigation<SignUP_DocterScreenNavigationProp>();

  const [inputstate, setinputstate] = useState({
    name: '',
    familyName: '',
    email: '',
    tel: '',
    Specialite: '',
    password: '',
    confirmation: ''
  });

  const [showValidation, setshowvalidation] = useState({
    name: false,
    familyName: false,
    email: false,
    tel: false,
    Specialite: false,
    password: false,
    confirmation: false
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  function checkvalidation() {
    const AreValide = {
      name: false,
      familyName: false,
      email: true,
      tel: true,
      Specialite: true,
      password: false,
      confirmation: false
    };

    if (inputstate.name.length < 3 || inputstate.name.length > 64) {
      setshowvalidation((state) => ({ ...state, name: true }));
    } else {
      AreValide.name = true;
      setshowvalidation((state) => ({ ...state, name: false }));
    }
    if (inputstate.familyName.length < 3 || inputstate.familyName.length > 64) {
      setshowvalidation((state) => ({ ...state, familyName: true }));
    } else {
      AreValide.familyName = true;
      setshowvalidation((state) => ({ ...state, familyName: false }));
    }

    if (inputstate.password.length < 6 || !/\d/.test(inputstate.password)) {
      setshowvalidation((state) => ({ ...state, password: true }));
    } else {
      AreValide.password = true;
      setshowvalidation((state) => ({ ...state, password: false }));
    }

    if (inputstate.confirmation !== inputstate.password) {
      setshowvalidation((state) => ({ ...state, confirmation: true }));
    } else {
      AreValide.confirmation = true;
      setshowvalidation((state) => ({ ...state, confirmation: false }));
    }

    return Object.values(AreValide).every((v) => v);
  }

  const handleSubmit = async () => {
    if (checkvalidation()) {
      const nouvelUtilisateur = {
        Name: inputstate.name,
        FamilyName: inputstate.familyName,
        Specialite: inputstate.Specialite,
        Tel: inputstate.tel,
        Email: inputstate.email,
        Password: inputstate.password,
        Role : 'Docter'
        
      }
      


      try {
        const response = await axios.post(`http://${URL}:3002/api/doctors/register`, nouvelUtilisateur);
        const data = response.data;
        console.log(data);
        setSuccessMessage("Account created successfully.");
        Alert.alert("your account has been created")
        navigation.navigate('SignIn_Docter')
      } catch (error) {
        setServerError("An error occurred. Please try again.");
      }
     
      
    }
  };

  return (
    
    <ScrollView contentContainerStyle={(Platform.OS=="web"?commonStyles.scrollContainerWeb:commonStyles.scrollContainer)}>    
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Create Account</Text>
        {successMessage && <Text style={commonStyles.successMessage}>{successMessage}</Text>}
        {serverError && <Text style={commonStyles.errorText}>{serverError}</Text>}
        <View style={commonStyles.form}>
          <Name inputstate={inputstate} setinputstate={setinputstate} showValidation={showValidation} />
          <FamilyName inputstate={inputstate} setinputstate={setinputstate} showValidation={showValidation} />
          <Email inputstate={inputstate} setinputstate={setinputstate} />
          <Specialite inputstate={inputstate} setinputstate={setinputstate} />
          <Tel inputstate={inputstate} setinputstate={setinputstate} />
          <PassWord inputstate={inputstate} setinputstate={setinputstate} showValidation={showValidation} />
          <Confirmation inputstate={inputstate} setinputstate={setinputstate} showValidation={showValidation} />
        </View>
        <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
          <Text style={commonStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.signupButton} onPress={() => {navigation.navigate('SignIn_Docter')}}>
          <Text style={commonStyles.buttonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUP_Docter;

const commonStyles = StyleSheet.create({
  scrollContainerWeb: {
   
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
    paddingHorizontal: 20,
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
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
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
