import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the SearchService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SearchService {

  constructor(public http: Http) {
    console.log('Landed SearchService Provider');
  }


/*
  public searchFunc(): {

  var spot = 'https://api.spotify.com/v1/search?q='

  }
*/
}
