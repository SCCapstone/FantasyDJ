import { Observable } from 'rxjs/Observable';
import { Song } from '../models/fantasydj-models';

export class SongDataMock {

  public static SONGS: Array<Song> = [
    <Song>{
      id: '-Kbm_0zJte213XcoYf8w',
      artist: 'Artist 1',
      name: 'Song 1',
      spotifyId: '5WKhE1otfbZr5jmIMIQ8qR',
      leagues: []
    },
    <Song>{
      id: '-Kbm_An-kXIk6o69eU18',
      artist: 'Artist 2',
      name: 'Song 2',
      spotifyId: '0NTMtAO2BV4tnGvw9EgBVq',
      leagues: []
    },
    <Song>{
      id: '-Kbm_6vA1NuUGLXavpc8',
      artist: 'Artist 3',
      name: 'Song 3',
      spotifyId: '5pKJtX4wBeby9qIfFhyOJj',
      leagues: []
    },
  ];

  loadSong(songId: string): Promise<Song> {
    return Promise.resolve(SONGS[0]);
  }

  loadSongs(leagueId: string,
            userId: string): Observable<Song[]> {
    return Observable.from(SONGS);
  }

};
