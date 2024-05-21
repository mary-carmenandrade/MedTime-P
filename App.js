import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabView from "./src/screens/TabView";
import Login from "./src/screens/Home/Login";
import CalendarScreen from "./src/screens/Calendar/CalendarScreen";
import Registrarse from "./src/screens/Home/Registrarse"; // Importa la pantalla Registrarse
import Details from "./src/screens/Details/Details";
import DateDetailsScreen from "./src/screens/Calendar/DateDetailsScreen";
import NewAppointmentScreen from './src/screens/Calendar/NewAppointmentScreen';
import EditAppointmentScreen from './src/screens/Calendar/EditAppointmentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        initialRouteName={isAuthenticated ? "TabView" : "Login"}
      >
        <Stack.Screen name="TabView">
          {props => <TabView {...props} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {props => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="Registrarse">
          {props => <Registrarse {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="DateDetails" component={DateDetailsScreen} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="NewAppointment" component={NewAppointmentScreen} />
        <Stack.Screen name="EditAppointment" component={EditAppointmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
