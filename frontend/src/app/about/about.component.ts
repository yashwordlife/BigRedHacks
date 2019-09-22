import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  version: string | null = environment.version;
  meetings: Object;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://10.33.0.107:3000/meetings').subscribe(data => this.loadData(data));
  }
  loadData(data: Object) {
    var d = new Date();
    this.meetings = data;
    for (var item in data) {
      data[item].timestamp = d.setTime(data[item].timestamp._seconds * 1000);
      this.meetings[item].timestamp = data[item].timestamp;
    }
  }
}
