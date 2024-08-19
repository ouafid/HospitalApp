import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'



interface PseudoProps{
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
      // showValidation: {
      //   name:boolean
      //   familyName:boolean
      //   email :boolean
      //   tel:boolean
      //   adress:boolean
      //   password: boolean;
      //   confirmation:boolean
        
      // };
}
const Email :React.FC<PseudoProps> = ({inputstate,setinputstate}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
            style={styles.input}
            value={inputstate.email}
            onChangeText={(text) => setinputstate({ ...inputstate, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
        />
    </View>
);
};

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

export default Email;
