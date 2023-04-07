import { Component } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Minecraft-Tracker';

  generalData = {};
  serversData = {};
  graphData!: any;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.connect().subscribe({
      next: msg => {
        const data = JSON.parse(JSON.stringify(msg));
        if(data.message == 'init') {
          this.generalData = data;
          this.apiService.connect().next('requestHistoryGraph');
          console.log(data);
        } else if(data.message == 'updateServers') {
          this.serversData = data;
        } else if(data.message == 'historyGraph') {
          this.graphData = data;
        }
      }, error: err => {
        console.log(err);
      }
    });
  }
}
