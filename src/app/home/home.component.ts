import { Component, OnInit, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/skipUntil';
import { Subject } from 'rxjs/Subject';

// Services
import { SharedService } from '../shared/services/shared.service';

// Models
import { Player } from '../shared/models/player.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public players: Player[];

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin : 0,
          suggestedMax : 100
        }
      }]
    }
  };
  public barChartType = 'bar';
  public barChartLabels: string[];
  public barChartData: any[];

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.getPlayers();
    this.sharedService.batchPlayers
    .takeUntil(this.ngUnsubscribe)
    .subscribe(players => {
      this.players = players;
      this.barChartLabels = [...(this.players.map(player => player.uniqueId))];
      this.barChartData = [
        {
          data: [...(this.players.map(player => Math.round((100 * player.stats['goals']) / player.stats['shots'])))],
          label: 'Ratio tir/but'
        }
      ];
      console.log(this.barChartLabels);
      console.log(this.barChartData);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
