// src/services/youtubeApi.ts
import axios from "axios";
import {
  YOUTUBE_API_KEY,
  API_CONFIG,
  SEARCH_CATEGORIES,
} from "../constants/api";
import { Video, YTResponse, SearchParams } from "../types/video";

const youtubeApi = axios.create({
  baseURL: API_CONFIG.baseURL,
  params: {
    key: YOUTUBE_API_KEY,
  },
});

export const youtubeService = {
  /**
   * Wyszukaj filmy po kategorii
   */
  async searchByCategory(
    category: "React Native" | "React" | "TypeScript" | "JavaScript"
  ): Promise<Video[]> {
    try {
      const categoryConfig = SEARCH_CATEGORIES.find((c) => c.name === category);
      if (!categoryConfig) {
        throw new Error(`Kategoria ${category} nie istnieje`);
      }

      const response = await youtubeApi.get<YTResponse>("/search", {
        params: {
          part: "snippet",
          q: categoryConfig.query,
          type: "video",
          maxResults: API_CONFIG.maxResults,
          order: "relevance",
          regionCode: "US",
          relevanceLanguage: "en",
        },
      });

      return response.data.items.map((item, index) => ({
        id: `${category}-${index}`,
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        category: category as any,
      }));
    } catch (error) {
      console.error(`Błąd przy wyszukiwaniu kategorii ${category}:`, error);
      throw error;
    }
  },

  /**
   * Wyszukaj filmy po frazie
   */
  async searchVideos(params: SearchParams): Promise<Video[]> {
    try {
      const response = await youtubeApi.get<YTResponse>("/search", {
        params: {
          part: "snippet",
          type: "video",
          maxResults: params.maxResults || API_CONFIG.searchMaxResults,
          order: params.order || "relevance",
          q: params.q,
          pageToken: params.pageToken,
          regionCode: "US",
          relevanceLanguage: "en",
        },
      });

      return response.data.items.map((item, index) => ({
        id: `search-${index}`,
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        category: "React Native",
      }));
    } catch (error) {
      console.error("Błąd przy wyszukiwaniu wideo:", error);
      throw error;
    }
  },

  /**
   * Pobierz szczegóły wideo
   */
  async getVideoDetails(videoId: string): Promise<any> {
    try {
      const response = await youtubeApi.get("/videos", {
        params: {
          part: "snippet,statistics,contentDetails",
          id: videoId,
        },
      });

      if (response.data.items.length === 0) {
        throw new Error("Wideo nie znalezione");
      }

      const item = response.data.items[0];
      return {
        videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount || "0"),
        likeCount: parseInt(item.statistics.likeCount || "0"),
        duration: item.contentDetails.duration,
      };
    } catch (error) {
      console.error("Błąd przy pobieraniu szczegółów wideo:", error);
      throw error;
    }
  },

  /**
   * Pobierz URL do wideo (YouTube player)
   */
  getVideoUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  },

  /**
   * Pobierz embed URL
   */
  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  },
};
