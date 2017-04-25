/**
 * All interfaces for objects coming from Spotify API queries
 */
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

export interface SpotifyImageable {
  images: SpotifyImage[]
}

export interface SpotifyUser extends SpotifySimplifiedObject, SpotifyImageable{
  display_name: string,
  email?: string
};

export interface SpotifySimplifiedArtist extends SpotifySimplifiedObject {};

export interface SpotifyArtist extends SpotifySimplifiedArtist, SpotifyImageable {};

export interface SpotifyArtistable {
  artists: SpotifySimplifiedArtist[]
};

export interface SpotifySimplifiedTrack extends SpotifySimplifiedObject,
                                                SpotifyArtistable {};

export interface SpotifyTrack extends SpotifySimplifiedTrack {
  album: SpotifySimplifiedAlbum,
  popularity: number,
  preview_url: string
};

export interface SpotifySimplifiedAlbum extends SpotifySimplifiedObject,
                                                SpotifyImageable,
                                                SpotifyArtistable {};

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
