import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.load();
  }
}
