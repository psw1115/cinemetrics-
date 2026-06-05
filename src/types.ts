export interface Movie {
  rank: number;
  title: string;
  director: string;
  releaseDate?: string;
  audienceCount?: string;
  genre?: string;
  posterDescription?: string;
}

export interface CastMember {
  actor: string;
  character: string;
  imageUrl: string | null;
}

export interface Recommendation {
  title: string;
  reason: string;
}

export interface MovieDetail {
  title: string;
  sysnopsis: string;
  directors: string[];
  cast: CastMember[];
  trailerQuery: string;
  rating: number;
  highlights: string[];
  funFacts?: string[];
  visualTheme: {
    primaryColor: string;
    mood: string;
  };
  recommendations: Recommendation[];
}
