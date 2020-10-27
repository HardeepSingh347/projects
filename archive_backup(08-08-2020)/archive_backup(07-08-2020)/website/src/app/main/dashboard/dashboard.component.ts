import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/helper/alert/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  toggledStatus = true;
  constructor(private helperService: AlertService) { }

  ngOnInit(): void {
    this.helperService.toggled.subscribe(toggled => {
      this.toggledStatus = toggled;
    });
  }
}
