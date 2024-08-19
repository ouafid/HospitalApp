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
    
}
const Adress :React.FC<PseudoProps> = ({inputstate,setinputstate}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.label}>Specialite:</Text>
        <TextInput
            style={styles.input}
            value={inputstate.Specialite}
            onChangeText={(text) => setinputstate({ ...inputstate, Specialite: text })}
            placeholder="Enter your specialite"
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
export default Adress

