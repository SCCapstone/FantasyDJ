import { League, Song, User } from '../models/fantasydj-models';
import { SpotifyTrack } from '../models/spotify-models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class LeagueDataMock {

  loadLeague(leagueId: string): Promise<League> {
    return Promise.resolve(null);
  }

  loadLeagues(userId: string): Observable<League[]> {
    let leagues: League[] = [];
    return Observable.of(leagues);
  }

  loadCurrentLeagues(userId: string): Observable<League[]> {
    return this.loadLeagues(null);
  }

  loadPastLeagues(userId: string): Observable<League[]> {
    return this.loadLeagues(null);
  }

  public updatePlaylist(userId: string,
                        leagueId: string,
                        spotifyTrack: SpotifyTrack): Promise<Song> {
    return Promise.resolve(null);
  }

  deleteLeague(leagueId): Promise<boolean> {
    return Promise.resolve(true);
  }

  getOpponent(userId: string, leagueId: string): Promise<User> {
    return Promise.resolve(null);
  }

  getCreator(leagueId: string): Promise<User> {
    return Promise.resolve(null);
  }

  getWinner(leagueId: string): Promise<User> {
    return Promise.resolve(null);
  }

  getStartDate(leagueId: string): Promise<string> {
    return Promise.resolve(null);
  }

  getEndDate(leagueId: string): Promise<string> {
    return Promise.resolve(null);
  }

  public isCreator(leagueId: string, userId: string): Observable<boolean> {
    return Observable.of(true);
  }

  isWinner(leagueId: string): Observable<boolean> {
    return Observable.of(true);
  }

  getDates(leagueId: string): Promise<Date[]> {
    let dates: Date[] = [];
    return Promise.resolve(dates);
  }

  getDatesInner(startDate: Date, stopDate: Date): Promise<Date[]> {
    let dates: Date[] = [];
    return Promise.resolve(dates);
  }

  public getPlaylistScore(leagueId: string, userId: string): Observable<number> {
    return Observable.of(1);
  }

  public getSongScore(leagueId: string, userId: string, songId: string): Observable<number> {
    return Observable.of(1);
  }

  getLeagueData(leagueId: string, userId: string): Promise<any[]> {
    let songs: any[] = [
      [1], [1], [1]
    ];
    return Promise.resolve(songs);
  }

  getSongNames(leagueId: string, userId: string): Promise<any[]> {
    let names: any[] = [];
    return Promise.resolve(names);
  }
};
