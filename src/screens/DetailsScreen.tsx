// src/screens/DetailsScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { youtubeService } from "../services/youtubeApi";
import { TEST_VIDEO_URL } from "../constants/api";
import { Colors } from "../constants/colors";

// SVG ikony
import LeftArrowIcon from "../../assets/icons/leftarrow-icon.svg";
import VolumeIcon from "../../assets/icons/volume-icon.svg";
import AirplayIcon from "../../assets/icons/airplay-icon.svg";
import BackwardIcon from "../../assets/icons/backward-icon.svg";
import ForwardIcon from "../../assets/icons/forward-icon.svg";
import FullscreenIcon from "../../assets/icons/fullscreen-icon.svg";
import PlayIcon from "../../assets/icons/play-icon.svg";
import PauseIcon from "../../assets/icons/pause-icon.svg";

type Props = NativeStackScreenProps<RootStackParamList, "Details">;
type VideoDetails = Awaited<ReturnType<typeof youtubeService.getVideoDetails>>;

const BACKGROUND = "#F9FAFB";

export default function DetailsScreen({ route }: Props) {
  const { id } = route.params;
  const navigation = useNavigation();
  const colors = Colors.light;

  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<Video | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await youtubeService.getVideoDetails(id);
        setVideo(data);
      } catch (e) {
        console.error("Details error:", e);
        setError("Nie udało się załadować szczegółów video.");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !video) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Brak danych video."}</Text>
        <TouchableOpacity
          style={styles.backButtonError}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonErrorText}>Wróć</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSeek = async (offsetSeconds: number) => {
    if (!videoRef.current) return;
    const status = await videoRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    const newPosition = Math.max(
      0,
      Math.min(
        status.durationMillis ?? status.positionMillis,
        status.positionMillis + offsetSeconds * 1000
      )
    );

    await videoRef.current.setPositionAsync(newPosition);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Demo‑wideo HLS z opisu zadania
  const videoSource = {
    uri: TEST_VIDEO_URL,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* PLAYER */}
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={videoSource}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={!paused}
          isMuted={isMuted}
        />

        {/* Pasek górny */}
        <View style={styles.playerTopBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.circleButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <LeftArrowIcon width={20} height={20} />
          </TouchableOpacity>

          <View style={styles.playerTopRight}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={handleToggleMute}
            >
              <VolumeIcon width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton}>
              <AirplayIcon width={20} height={20} fill="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Środkowe kontrolki */}
        <View style={styles.playerCenterRow}>
          <TouchableOpacity
            style={styles.circleButtonLarge}
            onPress={() => handleSeek(-10)}
          >
            <BackwardIcon width={22} height={22} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setPaused((p) => !p)}
          >
            {paused ? (
              <PlayIcon width={26} height={26} fill="#FFFFFF" />
            ) : (
              <PauseIcon width={26} height={26} fill="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleButtonLarge}
            onPress={() => handleSeek(10)}
          >
            <ForwardIcon width={22} height={22} />
          </TouchableOpacity>
        </View>

        {/* Dolny pasek */}
        <View style={styles.playerBottomBar}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>2:08</Text>
            <Text style={styles.timeTextMuted}> / 11:57</Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFilled} />
            <View style={styles.progressHandle} />
          </View>

          <TouchableOpacity
            style={styles.circleButtonSmall}
            onPress={() => videoRef.current?.presentFullscreenPlayer()}
          >
            <FullscreenIcon width={18} height={18} fill="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* DALSZA CZĘŚĆ EKRANU */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>

        <Text style={styles.channelLabel}>Channel name</Text>
        <Text style={styles.channelName}>{video.channelTitle}</Text>

        <View style={styles.tabsRow}>
          <Text style={[styles.tabText, styles.tabActive]}>Details</Text>
          <Text style={styles.tabText}>Notes</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{video.description}</Text>

        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Views</Text>
            <Text style={styles.statValue}>
              {video.viewCount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Likes</Text>
            <Text style={styles.statValue}>
              {video.likeCount.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  /* PLAYER */

  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },

  playerTopBar: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
  },
  playerTopRight: {
    flexDirection: "row",
    columnGap: 12,
  },

  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  circleButtonLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  circleButtonSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  playerCenterRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "45%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    zIndex: 15,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },

  playerBottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 15,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  timeText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  timeTextMuted: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Poppins-Regular",
  },
  progressBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 8,
    justifyContent: "center",
  },
  progressBarFilled: {
    width: "30%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#EF4444",
  },
  progressHandle: {
    position: "absolute",
    left: "30%",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
    top: -4,
  },

  /* RESZTA EKRANU */

  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24 + 72,
  },
  center: {
    flex: 1,
    backgroundColor: BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 16,
  },
  backButtonError: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#111827",
  },
  backButtonErrorText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
    marginBottom: 12,
  },
  channelLabel: {
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    color: "#6B7280",
  },
  channelName: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 16,
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#6B7280",
    paddingBottom: 8,
    marginRight: 24,
  },
  tabActive: {
    color: "#111827",
    borderBottomWidth: 2,
    borderBottomColor: "#111827",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#111827",
    marginRight: 12,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
});
