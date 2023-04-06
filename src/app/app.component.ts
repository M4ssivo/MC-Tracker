import { Component } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

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

  ngOnInit() {
    const subject = webSocket('wss://masivo.cc');

    subject.subscribe({
      next: msg => {
        const data = JSON.parse(JSON.stringify(msg));
        if(data.message == 'init') {
          this.generalData = data;
          subject.next('requestHistoryGraph');
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
