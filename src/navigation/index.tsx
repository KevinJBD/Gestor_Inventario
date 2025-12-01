// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantallaInicio from '../screen/Pantalla_Inicio';
import RegistroProductos from '../screen/Registro_Productos';

export type RootStackParamList = {
  Home: undefined;
  Registro: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="Home" component={PantallaInicio} options={{ title: 'Inventario' }} />
        <Stack.Screen name="Registro" component={RegistroProductos} options={{ title: 'Registrar producto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
