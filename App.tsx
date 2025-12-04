// App.tsx
import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

// ====== typy nawigacji ======
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Details: { id: string };
  Settings: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: { query?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// ====== dolny pasek (Home + Search) ======
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#8D99AE",
          borderTopWidth: 0,
          height: 72,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: "Poppins-Regular",
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "HomeTab") {
            const source = require("./assets/icons/home-icon.png");
            const tintColor = focused ? "#2B2D42" : "#ffffff";
            return (
              <Image
                source={source}
                style={{ width: 32, height: 32, tintColor }}
                resizeMode="contain"
              />
            );
          }

          if (route.name === "SearchTab") {
            const source = require("./assets/icons/search-icon.png");
            const tintColor = focused ? "#2B2D42" : "#ffffff";
            return (
              <Image
                source={source}
                style={{ width: 32, height: 32, tintColor }}
                resizeMode="contain"
              />
            );
          }

          return null;
        },
        tabBarActiveTintColor: "#2B2D42",
        tabBarInactiveTintColor: "#ffffff",
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ tabBarLabel: "Search" }}
      />
    </Tab.Navigator>
  );
}

// ====== główny stack ======
export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
