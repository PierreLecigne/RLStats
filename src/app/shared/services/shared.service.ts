import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Player } from '../models/player.model';

interface PlayerParam {
  name: string;
  platformId: string;
  uniqueId: string;
}

@Injectable()
export class SharedService {

  private params: any;
  private rlStatsApiKey: string;
  public playersParams: PlayerParam[];
  private baseUrl = 'https://api.rocketleaguestats.com/v1/';

  public batchPlayers: Subject<any> = new Subject<Player>();
  public isLoaded: Subject<boolean> = new Subject<boolean>();

  constructor(private http: Http, private httpHeaders: Http) {}

  load() {
    console.log('Try to load parameters file...');
    this.http.get('./assets/params.json')
    .map(res => res.json())
    .subscribe(params => {
      this.params = params;
      this.rlStatsApiKey = params.rlStatsApiKey;
      this.playersParams = params.players;

      console.log('Parameters file loaded successfully');
      this.isLoaded.next(true);
    });
  }

  getPlayers() {
    console.log('Try to get Players from API...');
    this.isLoaded.subscribe(isLoaded => {
      if (isLoaded) {
        console.log('Params file loaded, send request to API...');
        this.http.post(
          this.baseUrl + 'player/batch?apikey=' + this.rlStatsApiKey,
          JSON.stringify(this.playersParams),
          new RequestOptions({
            headers: new Headers({
              'Authorization': this.rlStatsApiKey, // doesn't work ?!
              'Content-Type': 'application/json'
            }),
            // withCredentials: true
          })
        )
        .map(res => res.json())
        .subscribe(players => {
          console.log('Players correctly retrived throught API');
          this.batchPlayers.next(players.map(player => {
            const pl = new Player(player);
            pl.name = this.playersParams.filter(playerParams => playerParams.uniqueId === pl.uniqueId).map(plPr => plPr.name)[0];
            // @TODO : fix name for XboxOne players
            return pl;
          }));
        });
      } else {
        console.log('Getting players from API not ready, params file not loaded yet');
      }
    });
  }

  // getPlayer() {
  //   return this.http.get(
  //     'https://api.rocketleaguestats.com/v1/player?apikey=' + this.rlStatsApiKey + '&unique_id=76561198005876595&platform_id=1',
  //     new RequestOptions({
  //       headers: new Headers({
  //         'Authorization': this.rlStatsApiKey, // doesn't work ?!
  //         'Content-Type': 'application/json'
  //       }),
  //       // withCredentials: true
  //     })
  //   ).map(res => res.json());
  // }

}
