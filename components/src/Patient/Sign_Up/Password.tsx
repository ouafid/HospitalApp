import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'



interface passWordProps {
  inputstate: {
    name: string
    familyName: string
    email: string
    tel: string
    adress: string
    password: string;
    confirmation: string

  };
  setinputstate: React.Dispatch<React.SetStateAction<{
    name: string
    familyName: string
    email: string
    tel: string
    adress: string
    password: string;
    confirmation: string

  }>>;
  showValidation: {
    name: boolean
    familyName: boolean
    email: boolean
    tel: boolean
    adress: boolean
    password: boolean;
    confirmation: boolean

  };
}

const PassWord: React.FC<passWordProps> = ({ inputstate, setinputstate, showValidation }) => {
  return (
    <View style={styles.container} >
      <Text style={styles.label} >Password:</Text>
      <TextInput
        style={styles.input}
        value={inputstate.password}
        onChangeText={(text) => setinputstate({ ...inputstate, password: text })}
        secureTextEntry={true}
        keyboardType="default"

      />
      <Text>{inputstate.password}</Text>
      {showValidation.password && <Text>Password must be at least 6 characters and contain a number.</Text>}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
      margin: 20,
      padding: 15,
      backgroundColor: '#f8f8f8',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
  },
  label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
  },
  input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
  },
});
export default PassWord
