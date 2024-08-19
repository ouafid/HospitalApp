import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'


interface ConfirmationProps{
    inputstate: {
        name:string
        familyName:string
        email :string
        tel:string
        Specialite:string
        password: string;
        confirmation:string
        
      };
      setinputstate: React.Dispatch<React.SetStateAction<{
        name:string
        familyName:string
        email :string
        tel:string
        Specialite:string
        password: string;
        confirmation:string
        
      }>>;
      showValidation: {
        name:boolean
        familyName:boolean
        email :boolean
        tel:boolean
        Specialite:boolean
        password: boolean;
        confirmation:boolean
        
      };
}
const Confirmation :React.FC<ConfirmationProps> = ({inputstate,setinputstate,showValidation}) => {
  return (
    <View  style={styles.container}>
    <Text style={styles.label}>Confirm Password:</Text>
    <TextInput
        style={styles.input}
        value={inputstate.confirmation}
        onChangeText={(text) => setinputstate({ ...inputstate, confirmation: text })}
        secureTextEntry={true}
    />
    <Text>{inputstate.confirmation}</Text>
    {showValidation.confirmation && <Text>Passwords do not match.</Text>}
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

export default Confirmation
