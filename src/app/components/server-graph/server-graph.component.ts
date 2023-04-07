import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { GeneralData } from 'src/app/models/generaldata';
import { ServerData } from 'src/app/models/serverdata';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-server-graph',
  templateUrl: './server-graph.component.html',
  styleUrls: ['./server-graph.component.css']
})
export class ServerGraphComponent {

  data!: GeneralData;

  public options: ChartOptions<'line'> = {
    spanGaps: true,
    normalized: true,
    animation: false,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour'
        }
      }
    }
  };

  constructor(
    private apiService: ApiService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.apiService.connect$().subscribe({
      next: data => {
        if(data.message == 'init') {
          this.data = data;
        } else if(data.message == 'updateServers') {

          this.data.timestampPoints.shift();
          this.data.timestampPoints.push(data.timestamp);

          for(let i = 1; i < data.updates.length; i++) {
            this.handleServerUpdate(data, this.data.servers[i], i);
          }

        }
      }, error: err => {
        console.log(err);
      }
    });
  }

  handleServerUpdate(data: any, server: ServerData, server_id: number) {
    server.playerCount = data.updates[server_id].playerCount;

    if(server.graphPeakData) { // check peak is not null
      if(server.playerCount > server.graphPeakData.playerCount) { // check if 24h peak is passed and set new record
        server.graphPeakData.playerCount = server.playerCount;
      }
    }

    server.playerCountHistory.shift();
    server.playerCountHistory.push(data.updates[server_id].playerCount);
  }

  getDataSet(server: ServerData) {
    return {
      labels: this.data.timestampPoints,
      datasets: [
        {
          data: server.playerCountHistory,
          fill: true,
          tension: 0.5,
          borderColor: '#9d7bf6',
          backgroundColor: 'transparent',
          pointStyle: 'circle',
          pointRadius: 1,
          pointHoverRadius: 3,
          pointBackgroundColor: '#9d7bf6'
        }
      ]
    }
  }

  handleMoment(time: any, format: string) {
    return moment(time).format(format);
  }
}
