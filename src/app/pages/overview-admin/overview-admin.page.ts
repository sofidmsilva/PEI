import { Component, OnInit } from '@angular/core';
declare var google;

@Component({
  selector: 'app-overview-admin',
  templateUrl: './overview-admin.page.html',
  styleUrls: ['./overview-admin.page.scss'],
})
export class OverviewAdminPage implements OnInit {

  constructor() {
    
   }

  ngOnInit() {
  }
   drawChart() {

    var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Work',     11],
      ['Eat',      2],
      ['Commute',  2],
      ['Watch TV', 2],
      ['Sleep',    7]
    ]);

    var options = {
      title: 'My Daily Activities'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
  }
}
