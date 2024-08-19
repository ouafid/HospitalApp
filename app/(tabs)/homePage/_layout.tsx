import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import AI from './AI';
import Profile from './Profile';
import RV from './RV';
import HomePat from './HomePat';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import HomeDoc from './HomeDoc';
import Appointments from './Appointments';
import SignOut from './SignOut';
import AdminBeds from './AdminBeds';
import AdminDoc from './AdminDoc';
import AdminNurs from './AdminNurs';
import AdminMedRec from './AdminMedRec';
import HomeStaff from './HomeStaff';
import StafDispos from './StafDispos';


type RootTabParamList = {
  HomeDoc: { user: { lastName: string; name: string; email: string; Role: string } };
  HomePat: { user: { lastName: string; name: string; email: string; Role: string } };
  AI: undefined;
  Profile: { user: { lastName: string; name: string; email: string; Role: string } };
  RV: { user: { lastName: string; name: string; email: string; Role: string } };
  Appointments: { user: { lastName: string; name: string; email: string; Role: string } };
  SignOut: undefined;
};

type LayoutRouteProp = RouteProp<RootTabParamList, 'HomeDoc'>;
type LayoutNavigationProp = BottomTabNavigationProp<RootTabParamList, 'HomeDoc'>;

interface LayoutProps {
  route: LayoutRouteProp;
  navigation: LayoutNavigationProp;
}

const Tab = createBottomTabNavigator<RootTabParamList>();
const Drawer = createDrawerNavigator();

const AdminDrawerNavigator: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#B3E5FC',
        },
      }}
    >
      <Drawer.Screen
        name="AdminDoc"
        component={AdminDoc}
        options={{
          drawerLabel: 'Doctors',
          headerTitleStyle: { display: "none" },
          drawerIcon: ({ color }) => (
            <TabBarIcon name='medkit-outline' color={color} />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="AdminNurs"
        component={AdminNurs}
        options={{
          drawerLabel: 'Nurses',
          headerTitleStyle: { display: "none" },
          drawerIcon: ({ color }) => (
            <TabBarIcon name='bandage-outline' color={color} />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="AdminMedRec"
        component={AdminMedRec}
        options={{
          drawerLabel: 'Med-Rec',
          headerTitleStyle: { display: "none" },
          drawerIcon: ({ color }) => (
            <TabBarIcon name='clipboard-outline' color={color} />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="AdminBeds"
        component={AdminBeds}
        options={{
          drawerLabel: 'Beds/Rooms',
          headerTitleStyle: { display: "none" },
          drawerIcon: ({ color }) => (
            <TabBarIcon name='bed-outline' color={color} />
          ),
        }}
        initialParams={{ user }}
      />
    </Drawer.Navigator>
  );
};

const _layoutDoc: React.FC<LayoutProps> = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName={user.Role === "Docter" ? "HomeDoc" : "HomePat"}
        screenOptions={{
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: { backgroundColor: '#B3E5FC' },
          headerTitleStyle: { display: "none" },
          headerStyle: {
            backgroundColor: '#B3E5FC',
          },
        }}
      >
        {user.Role === "Admin" && (
          <Tab.Screen
            name="AdminDrawer"
            component={AdminDrawerNavigator}
            options={{
              tabBarLabel: 'Dashboard',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'grid' : 'grid-outline'} color={color} />
              ),
            }}
            initialParams={{ user }}
          />
        )}

{user.Role === "Staff" && (
          <>
            <Tab.Screen
              name="HomeStaff"
              component={HomeStaff}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                ),
              }}
              initialParams={{ user }}
            />
            <Tab.Screen
              name="StafDispos"
              component={StafDispos}
              options={{
                tabBarLabel: 'Availability',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'time' : 'time-outline'} color={color} />
                ),
              }}
              initialParams={{ user }}
            />
          </>
        )}


        {user.Role === "Docter" && (
          <>
            <Tab.Screen
              name="HomeDoc"
              component={HomeDoc}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                ),
              }}
              initialParams={{ user }}
            />
            <Tab.Screen
              name="Appointments"
              component={Appointments}
              options={{
                tabBarLabel: 'Appointments',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
                ),
              }}
              initialParams={{ user }}
            />
          </>
        )}

        {user.Role !== "Admin" && user.Role !== "Docter" && user.Role !== "Staff" && (
          <Tab.Screen
            name="HomePat"
            component={HomePat}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
            }}
            initialParams={{ user }}
          />
        )}

        {(Platform.OS === 'web' && user.Role !== "Admin" && user.Role !== "Docter" && user.Role !== "Staff" ) && (
          <Tab.Screen
            name="AI"
            component={AI}
            options={{
              tabBarLabel: 'AI',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
              ),
            }}
          />
        )}

        {(user.Role !== "Admin" && user.Role !== "Docter" && user.Role !== "Staff") && (
          <Tab.Screen
            name="RV"
            component={RV}
            options={{
              tabBarLabel: 'Appointment',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
              ),
            }}
            initialParams={{ user }}
          />
        )}

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
          initialParams={{ user }}
        />

        <Tab.Screen
          name="SignOut"
          component={SignOut}
          options={{
            tabBarLabel: 'Sign Out',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'log-out' : 'log-out-outline'} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default _layoutDoc;

const styles = StyleSheet.create({});
