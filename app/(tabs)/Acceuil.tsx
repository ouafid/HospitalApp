import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './_layout'; // Assurez-vous d'importer le type RootStackParamList depuis votre fichier _layout.tsx

type AcceuilScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Acceuil'>;

export default function Acceuil() {
  const navigation = useNavigation<AcceuilScreenNavigationProp>();

  function Docter() {
    navigation.navigate("SignIn_Docter");
  }

  function Patient() {
    navigation.navigate("SignIn_Patient");
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: "https://i.notretemps.com/800x500/smart/2019/04/23/medecin04.jpg" }} style={styles.backgroundImage}>
        <View style={styles.ButtonView}>
          <Button
            title='personnel hospitalier'
            onPress={Docter}
          />
          <Text>  </Text>
          <Button
            onPress={Patient}
            title='Patient'
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // ou 'contain' selon vos besoins
    justifyContent: 'center',
  },
  ButtonView: {
    margin: 120,
  },
});
