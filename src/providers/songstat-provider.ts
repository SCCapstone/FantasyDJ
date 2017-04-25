/**
 * Provider for SongStats
 */
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { SongStat } from '../models/fantasydj-models';

@Injectable()
export class SongStatData {

  private fbSongStats: FirebaseListObservable<any[]>;
  private cachedStatIds: any = {};

  constructor(private db: AngularFireDatabase) {
    this.fbSongStats = this.db.list('SongStats');
  }

  /**
   * load SongStats by ID
   */
  public loadSongStat(songStatId: string): Promise<SongStat> {
    return new Promise<SongStat>((resolve, reject) => {
      this.db.object('SongStats/' + songStatId)
        .take(1)
        .map(this.mapFbSongStat)
        .subscribe(songStat => {
          if (! songStat) {
            reject('songStat does not exist');
          }
          resolve(songStat);
        });
    });
  }

  /**
   * maps Firebase JSON objects to SongStat objects
   */
  private mapFbSongStat(fbSongStat: any): SongStat {
    if ('$value' in fbSongStat && ! fbSongStat.$value) {
      return null;
    }

    let songStat = <SongStat>{
      id: fbSongStat.$key,
      songId: fbSongStat.songId,
      date: new Date(fbSongStat.date),
      popularity: fbSongStat.popularity
    };

    return songStat;
  }

  /**
   * converts a Date object to an ISO 'yyyy-mm-dd' string
   */
  private dateToStr(date: Date): string {
    return date.toISOString().substr(0, 10);
  }

  /**
   * cache SongStat IDs by song IDs and date
   */
  private cacheStatId(songStat: SongStat): void {
    if (! this.cachedStatIds[songStat.songId]) {
      this.cachedStatIds[songStat.songId] = {};
    }

    if (! this.cachedStatIds[songStat.songId][this.dateToStr(songStat.date)]) {
      this.cachedStatIds[songStat.songId][this.dateToStr(songStat.date)] = songStat.id;
    }
  }

  /**
   * determine if date is between startDate and endDate
   */
  private dateIsWithinRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  /**
   * comparison method for sorting SongStats by date
   */
  private statComparator(a: SongStat, b: SongStat): number {
    return a.date.getTime() - b.date.getTime()
  }

  /**
   * return SongStats for a given song during the given range of dates
   */
  public getSongStats(songId: string,
                      startDate: Date,
                      endDate: Date): Promise<SongStat[]> {
    return new Promise<SongStat[]>((resolve, reject) => {
      if (this.cachedStatIds[songId]) {
        // load SongStats from cached IDs
        let songStats: SongStat[] = [];
        for (let date in this.cachedStatIds[songId]) {
          if (this.dateIsWithinRange(new Date(date), startDate, endDate)) {
            this.loadSongStat(this.cachedStatIds[songId][date])
              .then(songStat => {
                songStats.push(songStat);
              })
              .catch(error => {
                reject(error);
              });
          }
        }
        songStats.sort(this.statComparator);
        resolve(songStats);
      }
      else {
        // load all SongStats for song from Firebase
        this.db.list('SongStats', {
          query: {
            orderByChild: 'songId',
            equalTo: songId
          }
        }).map(fbSongStats => {
          if (fbSongStats != null && fbSongStats.length > 0) {
            let songStats: SongStat[] = [];
            for (let fbSongStat of fbSongStats) {
              let songStat = this.mapFbSongStat(fbSongStat);
              // Cache SongStat IDs, or risk not being able to query them again because
              // they have already been emitted through the FirebaseListObservable.
              this.cacheStatId(songStat);
              if (this.dateIsWithinRange(songStat.date, startDate, endDate)) {
                // push SongStats to the array if they are relevant to the original date query
                songStats.push(songStat);
              }
            }
            songStats.sort(this.statComparator);
            return fbSongStats;
          }
          else {
            return null;
          }
        }).subscribe(songStats => {
          resolve(songStats);
        });
      }
    });
  }

  /**
   * Create new SongStat in Firebase
   */
  public addSongStat(songId: string, date: Date, popularity: number): Promise<SongStat> {
    return new Promise<SongStat>((resolve, reject) => {
      this.getSongStats(songId, date, date)
        .then(songStats => {
          if (! songStats) {
            let statId = this.fbSongStats.push({
              songId: songId,
              date: this.dateToStr(date),
              popularity: popularity
            }).key;
            if (statId) {
              this.loadSongStat(statId)
                .then(songStat => {
                  this.cacheStatId(songStat);
                  resolve(songStat);
                })
                .catch(error => {
                  reject(error);
                })
            }
          }
          else {
            resolve(songStats[0]);
          }
        })
        .catch(error => reject(error));
    });
  }

};
