import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { GeneralData } from 'src/app/models/generaldata';
import { ServerData } from 'src/app/models/serverdata';
import * as moment from 'moment';
import { WebSocketService } from 'src/app/services/websocket.service';

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
    private webSocketService: WebSocketService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.webSocketService.messages$.subscribe(data => {
      if(data.message == 'init') {
        this.data = data;

        this.data.servers.map((server, index) => (server.server_id = index)); // handle servers id

        this.data.timestampPoints = this.data.timestampPoints.map(secs => secs * 1000); // change seconds to milliseconds
      } else if(data.message == 'updateServers') {

        this.data.timestampPoints.shift();
        this.data.timestampPoints.push(data.timestamp * 1000);

        for(let i = 1; i < data.updates.length; i++) {
          this.handleServerUpdate(data, this.data.servers[i], i);
        }
      }
    });
  }

  handleServerUpdate(data: any, server: ServerData, server_id: number) {

    // error handler
    if(data.error) {
      server.error = data.error.message;
      return;
    }

    if(data.updates[server_id].playerCount == null) {
      server.error = 'Failed to ping';
      return;
    }

    server.error = '';

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

  getSortenedByPlayers(servers: ServerData[]) {
    return [...servers].sort((a, b) => this.getPlayerCount(b.playerCount) - this.getPlayerCount(a.playerCount));
  }

  getPlayerCount(count: number) {
    return count == null ? 0 : count;
  }

  handleMoment(time: any, format: string) {
    return moment(time).format(format);
  }

  isValid(count: number) {
    return count != null;
  }

  hasError(server: ServerData) {
    return server.error && server.error !== '';
  }
}
