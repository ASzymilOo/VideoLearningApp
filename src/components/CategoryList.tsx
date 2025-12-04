// src/components/CategoryList.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VideoCard } from "./VideoCard";
import { Video } from "../types/video";
import { youtubeService } from "../services/youtubeApi";
import { Colors } from "../constants/colors";
import type { RootStackParamList } from "../../App";

interface CategoryListProps {
  category: "React Native" | "React" | "TypeScript" | "JavaScript";
}

type Nav = NativeStackNavigationProp<RootStackParamList, "Details">;

const CategoryList: React.FC<CategoryListProps> = ({ category }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<Nav>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  useEffect(() => {
    loadVideos();
  }, [category]);

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await youtubeService.searchByCategory(category);
      setVideos(data.slice(0, 4));
    } catch (err) {
      console.error(`Błąd ładowania ${category}:`, err);
      setError(`Błąd ładowania ${category}`);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    navigation.navigate("Main", {
      screen: "SearchTab",
      params: { query: category },
    } as any);
  };

  const handleVideoPress = (video: Video) => {
    navigation.navigate("Details", { id: video.videoId });
  };

  return (
    <View style={styles.container}>
      {/* nagłówek sekcji */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{category}</Text>
        <TouchableOpacity onPress={handleShowMore}>
          <Text style={[styles.showMore, { color: colors.text }]}>
            Show more
          </Text>
        </TouchableOpacity>
      </View>

      {/* treść */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadVideos}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {videos.map((video) => (
            <View key={video.videoId} style={styles.videoWrapper}>
              <VideoCard video={video} onPress={handleVideoPress} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  header: {
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  showMore: {
    color: "#2B2D42",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textDecorationLine: "underline",
  },
  row: {
    paddingBottom: 4,
  },
  videoWrapper: {
    width: 260,
    marginRight: 16,
  },
  loadingContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
});
