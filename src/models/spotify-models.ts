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

export interface SpotifyArtist extends SpotifySimplifiedArtist {
  images: SpotifyImage[]
};

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

export interface SpotifyAlbum extends SpotifySimplifiedAlbum {
  tracks: SpotifyPagingObject<SpotifySimplifiedTrack>
};

export interface SpotifyPagingObject<T> {
  href: string,
  items: T[],
  limit: number,
  next: string,
  offset: number,
  previous: string,
  total: number
};

export interface SpotifySearchResult {
  artists?: SpotifyPagingObject<SpotifySimplifiedArtist>,
  albums?: SpotifyPagingObject<SpotifySimplifiedAlbum>,
  tracks?: SpotifyPagingObject<SpotifySimplifiedTrack>
};

export type SpotifySearchType = 'artist' | 'album' | 'track';

export const DEFAULT_SEARCH_TYPES: SpotifySearchType[] = [
  'artist',
  'album',
  'track'
]
