import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PseudoProps {
    inputstate: {
        email: string;
        password: string;
    };
    setinputstate: React.Dispatch<React.SetStateAction<{
        email: string;
        password: string;
    }>>;
}

const PassWord: React.FC<PseudoProps> = ({ inputstate, setinputstate }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
                style={styles.input}
                value={inputstate.password}
                onChangeText={(text) => setinputstate({ ...inputstate, password: text })}
                secureTextEntry={true}
                placeholder="Enter your password"
            />
            <Text style={styles.passwordText}>{inputstate.password}</Text>
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
    passwordText: {
        marginTop: 10,
        color: '#333',
    },
});

export default PassWord;
