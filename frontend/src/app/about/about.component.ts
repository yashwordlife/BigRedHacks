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
  meetings: any[];
  ogmeetings: any[];
  searchText: string;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/meetings').subscribe(data => this.loadData(data));
  }
  applyFilter() {
    this.meetings = this.ogmeetings.filter(meeting => {
      var meetingText = String(meeting.notes);
      if (meetingText.indexOf(this.searchText) != -1) return true;
      return false;
    });
  }
  loadData(data: any) {
    var d = new Date();
    this.meetings = data;
    this.ogmeetings = this.meetings;
    for (var item in data) {
      data[item].timestamp = d.setTime(data[item].timestamp._seconds * 1000);
      this.meetings[item].timestamp = data[item].timestamp;
    }
  }
}
