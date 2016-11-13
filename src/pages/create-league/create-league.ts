import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable} from 'angularfire2';

/*
  Generated class for the CreateLeague page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-league',
  templateUrl: 'create-league.html'
})
export class CreateLeaguePage {
  leagues: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public af:AngularFire) {
  	this.leagues = af.database.list('/Leagues');
  }
  

  ionViewDidLoad() {
    console.log('Hello CreateLeague Page');
  }



createLeague(name, opponent, draftDate){
 this.leagues.push({ 
 	Name: name, 
 	UserIDs: [opponent, 'currentUser'], 
 	Endtime: draftDate, 
 	Winner: null 
 	}).then( newLeague => { 
 		this.navCtrl.pop();
 	}, error => { 
 		console.log(error); 
 		}
 	); 
 }
}
