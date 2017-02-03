import { async } from '@angular/core/testing';
import { SongData } from './song-provider';
import { Song } from '../models/fantasydj-models';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2';
import { DbMock } from './angularfiredatabase.mock.ts';

describe('Providers: SongData', () => {
  let data: SongData = null;

  beforeEach(() => {
    data = new SongData(<AngularFireDatabase>(new DbMock()));
  });

  it('gets song by id', () => {
    data.loadSong(DbMock.SONG_1_ID).then(song => {
      expect(song.id).toEqual(DbMock.SONG_1_ID);
    });
  });

  // it('gets songs by league and user', () => {
  //   data.loadSongs(DbMock.LEAGUE_1_ID, DbMock.USER_1_ID).subscribe(songs => {
  //     expect(songs[0].id).toEqual(DbMock.SONG_1_ID);
  //   });
  // });
});
