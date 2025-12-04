// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import { Colors } from "../constants/colors";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const categories: Array<
  "React Native" | "React" | "TypeScript" | "JavaScript"
> = ["React Native", "React", "TypeScript", "JavaScript"];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const colors = Colors.light;
  const [homeQueryKey, setHomeQueryKey] = useState(0);

  const handleSearchFromHome = (text: string) => {
    const query = text.trim();
    if (!query) return;

    navigation.navigate("Main", {
      screen: "SearchTab",
      params: { query },
    } as any);

    setHomeQueryKey((prev) => prev + 1);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pasek wyszukiwania + ikona settings */}
        <View style={styles.topRow}>
          <View style={styles.searchWrapper}>
            <SearchBar
              key={homeQueryKey}
              initialValue=""
              onSearch={handleSearchFromHome}
            />
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <Image
              source={require("../../assets/icons/settings-icon.png")}
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {categories.map((category) => (
          <CategoryList key={category} category={category} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 40,
    paddingBottom: 16 + 72,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 23,
  },
  searchWrapper: {
    width: 297,
    height: 44,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#111827",
    overflow: "hidden",
  },
  settingsButton: {
    marginLeft: 16,
    marginRight: 24,
  },
  settingsIcon: {
    width: 32,
    height: 32,
  },
});
