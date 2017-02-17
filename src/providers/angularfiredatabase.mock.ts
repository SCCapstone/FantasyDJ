import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class DbMock {

  private static PAT_ID = '\/[^\/\.\$\\[\\]\#]+';

  static PAT_USER = '^\/UserProfiles';
  static PAT_USER_ID = DbMock.PAT_USER + DbMock.PAT_ID;
  static PAT_USER_LEAGUES = DbMock.PAT_USER_ID + '\/leagues';
  static PAT_USER_LEAGUE_ID = DbMock.PAT_USER_LEAGUES + DbMock.PAT_ID;

  static PAT_LEAGUES = '^\/Leagues';
  static PAT_LEAGUE_ID = DbMock.PAT_LEAGUES + DbMock.PAT_ID;
  static PAT_LEAGUE_USERS = DbMock.PAT_LEAGUE_ID + '\/users';
  static PAT_LEAGUE_USER_ID = DbMock.PAT_LEAGUE_USERS + DbMock.PAT_ID;
  static PAT_LEAGUE_USER_SONG_ID = DbMock.PAT_LEAGUE_USER_ID + DbMock.PAT_ID;

  static PAT_SONGS = '^\/Songs';
  static PAT_SONG_ID = DbMock.PAT_SONGS + DbMock.PAT_ID;
  static PAT_SONG_LEAGUES = DbMock.PAT_SONG_ID + '\/leagues';
  static PAT_SONG_LEAGUE_ID = DbMock.PAT_SONG_LEAGUES + DbMock.PAT_ID;

  static RE_USER_ID = RegExp(DbMock.PAT_USER_ID + '$');
  static RE_USER_LEAGUES = RegExp(DbMock.PAT_USER_LEAGUES + '$');
  static RE_USER_LEAGUE_ID = RegExp(DbMock.PAT_USER_LEAGUE_ID + '$');

  static RE_LEAGUE_ID = RegExp(DbMock.PAT_LEAGUE_ID + '$');
  static RE_LEAGUE_USERS = RegExp(DbMock.PAT_LEAGUE_USERS + '$');
  static RE_LEAGUE_USER_ID = RegExp(DbMock.PAT_LEAGUE_USER_ID + '$');
  static RE_LEAGUE_USER_SONG_ID = RegExp(DbMock.PAT_LEAGUE_USER_SONG_ID + '$');

  static RE_SONGS = RegExp(DbMock.PAT_SONGS + '$');
  static RE_SONG_ID = RegExp(DbMock.PAT_SONG_ID + '$');
  static RE_SONG_LEAGUE_ID = RegExp(DbMock.PAT_SONG_LEAGUE_ID + '$');

  static USER_1_ID = '-Kbmc8uoSAlb8Tre-j1P';
  static LEAGUE_1_ID = '-KbmR7uWBQKMzbRSyeN5';
  static SONG_1_ID = '-Kbm_0zJte213XcoYf8w';

  private user1: any = null;
  private league1: any = null;
  private song1: any = null;

  constructor() {
    this.initUsers();
    this.initLeagues();
    this.initSongs();
  }

  private initUsers(): void {
    this.user1 = {
      '$key': DbMock.USER_1_ID,
      'leagues': {},
      'dateCreated': '2017-01-01'
    }
    this.user1.leagues[DbMock.LEAGUE_1_ID] = true;
  }

  private initLeagues(): void {
    this.league1 = {
      '$key': DbMock.LEAGUE_1_ID,
      'name': 'Test League 1',
      'users': {}
    };
    this.league1.users[DbMock.USER_1_ID] = {};
    this.league1.users[DbMock.USER_1_ID][DbMock.SONG_1_ID] = true;
  }

  private initSongs(): void {
    this.song1 = {
      '$key': DbMock.SONG_1_ID,
      'artist': 'Artist 1',
      'name': 'Song 1',
      'spotifyId': '5WKhE1otfbZr5jmIMIQ8qR',
      'leagues': {}
    };
    this.song1.leagues[DbMock.LEAGUE_1_ID] = true;
  }

  object(path: string): Observable<any> {
    if (DbMock.RE_USER_ID.test(path)) {
      return Observable.of(this.user1);
    }

    if (DbMock.RE_USER_LEAGUE_ID.test(path)) {
      return Observable.of(this.user1.leagues[DbMock.LEAGUE_1_ID]);
    }

    if (DbMock.RE_LEAGUE_ID.test(path)) {
      return Observable.of(this.league1);
    }

    if (DbMock.RE_LEAGUE_USER_ID.test(path)) {
      return Observable.of(this.league1.users[DbMock.USER_1_ID]);
    }

    if (DbMock.RE_LEAGUE_USER_SONG_ID.test(path)) {
      return Observable.of(
        this.league1.users[DbMock.USER_1_ID][DbMock.SONG_1_ID]
      );
    }

    if (DbMock.RE_SONG_ID.test(path)) {
      return Observable.of(this.song1);
    }

    if (DbMock.RE_SONG_LEAGUE_ID.test(path)) {
      return Observable.of(this.song1.leagues[DbMock.LEAGUE_1_ID]);
    }

    return null;
  }

  private static listByIds(...objs: any[]): Observable<any> {
    let val = {};
    for (let obj of objs) {
      val[obj['$key']] = obj;
    }
    return Observable.of(val);
  }

  list(path: string,
       query?: any,
       preserveSnapshot?: boolean): Observable<any> {

    if (DbMock.RE_USER_LEAGUES.test(path)) {
      return Observable.of(this.user1.leagues);
    }

    if (DbMock.RE_SONGS.test(path)) {
      return DbMock.listByIds(this.song1);
    }

    if (DbMock.RE_LEAGUE_USERS.test(path)) {
      return Observable.of(this.league1.users);
    }

    if (DbMock.RE_LEAGUE_USER_ID.test(path)) {
      return Observable.of(this.league1.users[DbMock.USER_1_ID]);
    }
    return null;
  }

};
