// src/components/SearchBar.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  useColorScheme,
  Image,
} from "react-native";
import { Colors } from "../constants/colors";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onChangeText,
  placeholder = "Search videos",
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue);
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleChange = (text: string) => {
    setQuery(text);
    onChangeText?.(text);
  };

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/icons/search-icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor="#2B2D4299"
        value={query}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
});
