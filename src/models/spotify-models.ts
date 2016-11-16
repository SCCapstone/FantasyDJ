export interface SpotifyUser {
  id: string,
  display_name: string
};

export interface SpotifyImage {
  url: string,
  width: number,
  height: number
};

export interface SpotifySimplifiedObject {
  href: string,
  id: string,
  name: string,
  uri: string
};

export interface SpotifySimplifiedArtist extends SpotifySimplifiedObject {};

export interface SpotifySimplifiedTrack extends SpotifySimplifiedObject {
  artists: SpotifySimplifiedArtist[]
};

export interface SpotifyTrack extends SpotifySimplifiedTrack {
  album: SpotifySimplifiedAlbum,
  popularity: number,
  preview_url: string
};

export interface SpotifySimplifiedAlbum extends SpotifySimplifiedObject {
  artists: SpotifySimplifiedArtist[],
  images: SpotifyImage[]
};

export interface SpotifySearchResultPage<T> {
  href: string,
  items: T[],
  limit: number,
  next: string,
  offset: number,
  previous: string,
  total: number
};

export interface SpotifySearchResult {
  artists?: SpotifySearchResultPage<SpotifySimplifiedArtist>,
  albums?: SpotifySearchResultPage<SpotifySimplifiedAlbum>,
  tracks?: SpotifySearchResultPage<SpotifySimplifiedTrack>
};
