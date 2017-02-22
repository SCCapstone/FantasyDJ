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

  private dateToStr(date: Date): string {
    return date.toISOString().substr(0, 10);
  }

  private cacheStatId(songStat: SongStat): void {
    if (! this.cachedStatIds[songStat.songId]) {
      this.cachedStatIds[songStat.songId] = {};
    }

    if (! this.cachedStatIds[songStat.songId][this.dateToStr(songStat.date)]) {
      this.cachedStatIds[songStat.songId][this.dateToStr(songStat.date)] = songStat.id;
    }
  }

  private dateIsWithinRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  private statComparator(a: SongStat, b: SongStat): number {
    return a.date.getTime() - b.date.getTime()
  }

  public getSongStats(songId: string,
                      startDate: Date,
                      endDate: Date): Promise<SongStat[]> {
    return new Promise<SongStat[]>((resolve, reject) => {
      if (this.cachedStatIds[songId]) {
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
              this.cacheStatId(songStat);
              if (this.dateIsWithinRange(songStat.date, startDate, endDate)) {
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
