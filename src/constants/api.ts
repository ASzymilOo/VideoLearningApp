// src/constants/api.ts

// Odczyt z .env
export const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YT_API_KEY || '';

// Kategorie do wyszukiwania
export const SEARCH_CATEGORIES = [
  { name: 'React Native', query: 'React Native tutorial' },
  { name: 'React', query: 'React tutorial' },
  { name: 'TypeScript', query: 'TypeScript tutorial' },
  { name: 'JavaScript', query: 'JavaScript tutorial' },
];

// Konfiguracja API
export const API_CONFIG = {
  baseURL: 'https://www.googleapis.com/youtube/v3',
  maxResults: 12,
  searchMaxResults: 20,
};

// Test video URL
export const TEST_VIDEO_URL = 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
