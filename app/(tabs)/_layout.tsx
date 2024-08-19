import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Acceuil from './Acceuil';
import SignIn_Docter from './SignIn_Docter';
import SignUP_Docter from './SignUP_Docter';
import SignIn_Patient from './SignIn_Patient';
import SignUP_Patient from './SignUP_Patient';
import _layoutDoc from '@/app/(tabs)/homePage/_layout';
import Hospitalization from './homePage/MedicalRecord';
import HomeDoc from './homePage/HomeDoc';


// Définition des paramètres du stack
export type RootStackParamList = {
    Acceuil: undefined;
    SignIn_Docter: undefined;
    SignUP_Docter: undefined;
    SignIn_Patient: undefined;
    SignUP_Patient: undefined;
    _layoutDoc: { user?: any };
    HomeDoc: undefined;
    Hospitalization: { Hospitalization: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const _layout: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="Acceuil">
            <Stack.Screen name="Acceuil" component={Acceuil} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn_Docter" component={SignIn_Docter} options={{ headerShown: false }} />
            <Stack.Screen name="SignUP_Docter" component={SignUP_Docter} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn_Patient" component={SignIn_Patient} options={{ headerShown: false }} />
            <Stack.Screen name="SignUP_Patient" component={SignUP_Patient} options={{ headerShown: false }} />
            <Stack.Screen name="_layoutDoc" component={_layoutDoc} options={{ headerShown: false }}  />
            <Stack.Screen name="Hospitalization" component={Hospitalization} options={{ headerShown: false }} />
            <Stack.Screen name="HomeDoc" component={HomeDoc} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Hopitale" component={Hopitale} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    );
};

export default _layout;
