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
  meetings: any[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://10.33.0.107:3000/meetings').subscribe(data => (this.meetings = data));
  }
}
