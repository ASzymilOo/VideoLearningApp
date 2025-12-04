// src/types/video.ts
export interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  viewCount?: number;
  likeCount?: number;
  url?: string;
  category: 'React Native' | 'React' | 'TypeScript' | 'JavaScript';
}

export interface SearchParams {
  q: string;
  maxResults?: number;
  order?: 'relevance' | 'date' | 'viewCount';
  pageToken?: string;
}

export interface YTResponse {
  items: Array<{
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      publishedAt: string;
      title: string;
      description: string;
      thumbnails: {
        high: {
          url: string;
        };
      };
      channelTitle: string;
    };
    statistics?: {
      viewCount: string;
      likeCount: string;
    };
  }>;
  nextPageToken?: string;
}
