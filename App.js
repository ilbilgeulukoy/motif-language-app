import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from './src/context/ThemeContext';
import { WordbookProvider } from './src/context/WordbookContext';
import SozlukScreen from './src/screens/SozlukScreen';
import DefterScreen from './src/screens/DefterScreen';
import CalisScreen from './src/screens/CalisScreen';
import TabBar from './src/components/TabBar';
import KesifScreen from './src/screens/KesifScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <ThemeProvider>
      <WordbookProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{ headerShown: false }}
          >
            <Tab.Screen name="Sozluk" component={SozlukScreen} />
            <Tab.Screen name="Defter" component={DefterScreen} />
            <Tab.Screen name="Calis" component={CalisScreen} />
            <Tab.Screen name="Kesif" component={KesifScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </WordbookProvider>
    </ThemeProvider>
  );
}

export default registerRootComponent(App);
