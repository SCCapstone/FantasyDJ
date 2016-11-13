import { Injectable } from '@angular/core';
import {
  AngularFire,
  FirebaseListObservable,
  FirebaseObjectObservable} from 'angularfire2';

@Injectable()
export class UserData {
  userList: FirebaseListObservable<any>;
  userDetail: FirebaseObjectObservable<any>;

  constructor(public af: AngularFire) {
    this.userList = this.af.database.list('/users');
  }

  getUser(userId: number) {
    return this.userDetail = this.af.database.object('/users/' + userId);
  }

  createUser(name: string, spotifyId: string) {
    return this.userList.push({
      name: name,
      spotifyId: spotifyId
    });
  }
};
