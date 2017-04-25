/**
 * Mock SongStat provider for testing. Implements all public
 * methods from songstat-provider.ts.
 */
import { SongStat } from '../models/fantasydj-models';

export class SongStatDataMock {

  public loadSongStat(songStatId: string): Promise<SongStat> {
    return Promise.resolve(null);
  }

  public getSongStats(songId: string, startDate: Date, endDate: Date): Promise<SongStat[]> {
    let stats: SongStat[] = [];
    return Promise.resolve(stats);
  }

  public addSongStat(songId: string, date: Date, popularity: number): Promise<SongStat> {
    return Promise.resolve(null);
  }

};
