import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var MediaRecorder: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public mediaRecorder: any;
  public meetingName: string;
  public audiochunks: any[] | BlobPart[] = [];
  public currentFile: File;
  public isRecording: boolean = false;
  public isSummary: boolean = false;
  public summary: string;

  startRecording() {
    this.isRecording = true;
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(this.handleSuccess.bind(this));
  }
  quote: string | undefined;
  isLoading = false;
  @ViewChild('player', { static: false }) player: ElementRef;

  constructor(private quoteService: QuoteService, private http: HttpClient) {}
  handleSuccess(stream: any) {
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.start();

    var that = this;
    this.mediaRecorder.addEventListener('dataavailable', function(e: { data: any }) {
      that.audiochunks.push(e.data);
    });

    this.mediaRecorder.addEventListener('stop', () => {
      // const audioBlob = new Blob(this.audiochunks, { 'type' : 'audio/mpeg-3' });
      // const audioUrl = URL.createObjectURL(audioBlob);
      // const audio = new Audio(audioUrl);
      // this.player.nativeElement.src = audioUrl;
      // this.currentFile = new File([audioBlob], "myfile")
      // console.log(this.meetingName);
      // let formData = new FormData();
      // formData.append('myFile', this.currentFile, this.meetingName);
      // this.http.post('http://10.33.0.107:3000/', formData).subscribe(data => this.loadSummary(data));
    });
  }
  loadSummary(data: any) {
    this.summary = data;
    console.log(data);
  }
  stopRecording() {
    this.isRecording = false;
    this.mediaRecorder.stop();
    this.audiochunks = [];
  }
  pauseRecording() {
    this.isRecording = false;
    this.mediaRecorder.stop();
  }
  public uploadFile(file: File) {
    const audioBlob = new Blob(this.audiochunks, { type: 'audio/mpeg-3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    this.player.nativeElement.src = audioUrl;
    this.currentFile = new File([audioBlob], 'myfile');
    console.log(this.meetingName);
    let formData = new FormData();
    formData.append('myFile', this.currentFile, this.meetingName);
    this.http.post('http://10.33.0.107:3000/', formData).subscribe(data => this.loadSummary(data));
  }
  ngOnInit() {
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }
}
