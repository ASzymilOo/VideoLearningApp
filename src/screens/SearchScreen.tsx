// src/screens/SearchScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { MainTabParamList } from "../../App";
import type { RootStackParamList } from "../../App";
import SearchBar from "../components/SearchBar";
import { VideoCard } from "../components/VideoCard";
import { youtubeService } from "../services/youtubeApi";
import { Colors } from "../constants/colors";
import { Video } from "../types/video";

type Props = BottomTabScreenProps<MainTabParamList, "SearchTab">;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen({ route }: Props) {
  const initialQueryFromRoute = route.params?.query ?? "";
  const navigation = useNavigation<Nav>();

  const [query, setQuery] = useState(initialQueryFromRoute);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOWY JEDNOLITY TYP SORTOWANIA
  const [sortBy, setSortBy] = useState<
    "date_latest" | "date_oldest" | "popular"
  >("date_latest");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [pendingSort, setPendingSort] = useState<
    "date_latest" | "date_oldest" | "popular"
  >("date_latest");

  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  // useEffect URUCHAMIA WYSZUKIWANIE DLA query Z ROUTE I PRZY ZMIANIE sortBy
  useEffect(() => {
    if (initialQueryFromRoute) {
      setQuery(initialQueryFromRoute);
      performSearch(initialQueryFromRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQueryFromRoute, sortBy]);

  const performSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setError(null);
      setVideos([]);
      return;
    }

    setLoading(true);
    setError(null);
    setVideos([]);

    // MAPUJEMY sortBy NA PARAMETR order
    const order: "date" | "viewCount" =
      sortBy === "popular" ? "viewCount" : "date";

    try {
      const results = await youtubeService.searchVideos({
        q: trimmed,
        maxResults: 20,
        order, // używamy order, NIE sortBy
      });

      let finalResults = results;

      if (sortBy === "date_oldest") {
        // API zwraca od najnowszych – odwracamy lokalnie
        finalResults = [...results].reverse();
      }

      setVideos(finalResults);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Błąd podczas wyszukiwania";
      setError(errorMsg);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = (video: Video) => {
    navigation.navigate("Details", { id: video.videoId });
  };

  const trimmedQuery = query.trim();
  const hasResults = videos.length > 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Search bar jak na Home */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <SearchBar
            initialValue={query}
            onSearch={(q) => {
              setQuery(q);
              performSearch(q);
            }}
            onChangeText={(text) => {
              setQuery(text);
              if (!text.trim()) {
                setVideos([]);
                setError(null);
              }
            }}
          />
        </View>
      </View>

      {/* Header wyników + sort by */}
      {trimmedQuery.length > 0 && (
        <View style={styles.resultsHeader}>
          {hasResults && (
            <Text style={styles.resultsCount}>
              {videos.length} results found for:{" "}
              <Text style={styles.resultsQuery}>"{trimmedQuery}"</Text>
            </Text>
          )}
          <TouchableOpacity onPress={() => setIsSortModalVisible(true)}>
            <Text style={styles.sortBy}>
              Sort by:{" "}
              <Text style={styles.sortByValue}>
                {sortBy === "date_latest"
                  ? "Upload date: latest"
                  : sortBy === "date_oldest"
                  ? "Upload date: oldest"
                  : "Most popular"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Wyniki / stany */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Szukanie videów...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => query && performSearch(query)}
          >
            <Text style={styles.retryText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      ) : !hasResults ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {trimmedQuery
              ? "Brak wyników dla: " + trimmedQuery
              : "Wyszukaj coś aby zobaczyć wyniki"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={({ item }) => (
            <VideoCard video={item} onPress={handleVideoPress} />
          )}
          keyExtractor={(item) => item.videoId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* MODAL SORTOWANIA */}
      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sort records by:</Text>

            {[
              { key: "date_latest", label: "Upload date: latest" },
              { key: "date_oldest", label: "Upload date: oldest" },
              { key: "popular", label: "Most popular" },
            ].map((opt) => {
              const selected = pendingSort === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  style={styles.radioRow}
                  onPress={() =>
                    setPendingSort(
                      opt.key as "date_latest" | "date_oldest" | "popular"
                    )
                  }
                >
                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioOuterActive,
                    ]}
                  >
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{opt.label}</Text>
                </Pressable>
              );
            })}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSortBy(pendingSort);
                setIsSortModalVisible(false);
                if (query.trim()) {
                  performSearch(query);
                }
              }}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// STYLES BEZ ZMIAN
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 24,
  },
  searchBox: {
    height: 44,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2B2D42",
    overflow: "hidden",
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  resultsCount: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#6B7280",
    marginBottom: 4,
  },
  resultsQuery: {
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },
  sortBy: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#6B7280",
    textAlign: "right",
  },
  sortByValue: {
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },
  sortContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  sortButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    alignItems: "center",
  },
  sortButtonText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  errorText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    paddingBottom: 16 + 72,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#8D99AE",
  },
  modalTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 24,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioOuterActive: {
    borderColor: "#FFFFFF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1E213A",
  },
  radioLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#FFFFFF",
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: "#1E213A",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
