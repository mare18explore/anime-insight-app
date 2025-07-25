// Represents a single anime result returned from the AniList API
export type AnimeResult = {
  id: number;
  title: {
    romaji: string;
    english?: string;
  };
  //URL
  coverImage?: {
    large: string;
  };
  description?: string;
  genres?: string[];
  averageScore?: number;
};

export type RootStackParamList = {
  AnimeDetails: { anime: AnimeResult };
};