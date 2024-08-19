import React from 'react';
import { Button, View, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const handleDocumentPick = async () => {
    // Pick a document
    const result = await DocumentPicker.getDocumentAsync({});

    if (result.type === 'success') {
      const { uri, name, mimeType } = result;

      const formData = new FormData();
      formData.append('file', {
        uri,
        name,
        type: mimeType || 'application/pdf', // adjust the type based on your needs
      });

      try {
        const response = await fetch('http://192.168.65.59:8000/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const data = await response.json();
        Alert.alert('Upload Success', JSON.stringify(data));
      } catch (error) {
        Alert.alert('Upload Failed', error.message);
      }
    } else {
      Alert.alert('Document pick canceled');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick a document" onPress={handleDocumentPick} />
    </View>
  );
}
