import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';

import { MatchRequest, User } from '../models/fantasydj-models';

@Injectable()
export class MatchRequestData {

  private requestList: FirebaseListObservable<any>;

  constructor(private db: AngularFireDatabase) {
    this.requestList = db.list('Requests');
  }

  loadMatchRequest(requestId: string): Promise<MatchRequest> {
    return new Promise<MatchRequest>((resolve, reject) => {
      this.db.object('Requests/' + requestId).map(obj => {
        if ('$value' in obj && ! obj.$value) {
          return null;
        }

        let req = <MatchRequest>{
          id: obj.$key,
          user: obj.user,
          created: obj.created,
          fulfilled: obj.fulfilled
        };

        return req;
      }).subscribe(req => {
        if (! req) {
          reject('match request does not exist');
        }
        resolve(req);
      })
    });
  }

  createRequest(user: User): Promise<MatchRequest> {
    return new Promise<MatchRequest>((resolve, reject) => {
      let requestId: string = this.requestList.push({
        user: user.id,
        created: new Date(),
        fulfilled: false
      }).key;

      if (requestId) {
        this.loadMatchRequest(requestId)
          .then(req => resolve(req))
          .catch(error => reject(error));
      }
      else {
        reject('match request not pushed');
      }
    });
  }

};
