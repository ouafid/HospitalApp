import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

const SignOut: React.FC = () => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        // Logique de déconnexion (par exemple, effacer les données de connexion)
        // Vous pouvez également utiliser un contexte ou un service pour gérer l'authentification

        // Redirection après la déconnexion
        navigation.dispatch(StackActions.replace('Acceuil')); // Remplacez 'Acceuil' par le nom de l'écran d'accueil
    };

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Are you sure you want to sign out?</Text>
            <Button title="Sign Out" onPress={handleSignOut} color="#007bff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F7FA', // Light blue background color
        padding: 20,
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        color: '#007bff', // Light blue color for the text
        textAlign: 'center',
    },
});

export default SignOut;
