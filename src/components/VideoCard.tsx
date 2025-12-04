// src/components/VideoCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Video } from "../types/video";
import { Colors, getCategoryColor } from "../constants/colors";

interface VideoCardProps {
  video: Video;
  onPress?: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const handlePress = () => {
    onPress?.(video);
  };

  const truncateTitle = (text: string, lines: number = 2) => {
    const arr = text.split("\n");
    return arr.slice(0, lines).join("\n");
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {truncateTitle(video.title)}
        </Text>

        <Text
          style={[styles.channel, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {video.channelTitle}
        </Text>

        <Text
          style={[styles.date, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {new Date(video.publishedAt).toLocaleDateString("pl-PL")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 140,
    backgroundColor: "#000",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  title: {
    fontSize: 13,
    marginBottom: 4,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 18,
  },
  channel: {
    fontSize: 11,
    marginBottom: 2,
    fontFamily: "Poppins-Regular",
  },
  date: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
  },
});
