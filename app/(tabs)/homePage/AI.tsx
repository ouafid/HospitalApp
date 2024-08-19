import React from 'react';
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';

const AI = () => {
  const openStreamlitApp1 = () => {
    Linking.openURL('http://192.168.65.59:8502');
  };

  const openStreamlitApp2 = () => {
    Linking.openURL('http://192.168.65.59:8501');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Diagnostic Tools</Text>
      <Text style={styles.subtitle}>Access the following tools for medical diagnostics:</Text>

      <TouchableOpacity style={styles.button} onPress={openStreamlitApp1}>
        <Text style={styles.buttonText}>
          Open Medical Chatbot Diagnostic Assistant (PDF)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openStreamlitApp2}>
        <Text style={styles.buttonText}>
          Open Medical Diagnostic Assistant
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E0F7FA', // Light blue background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff', // Blue color for the title
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333', // Dark color for the subtitle
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AI;
