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
  timestamps: number[] = [];

  public options: ChartOptions<'line'> = {
    spanGaps: true,
    normalized: true,
    animation: false,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    scales: {
      y: {
        ticks: {
          precision: 0
        }
      },
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

        if(this.timestamps.length > 1) return; // check if timestamps is already loaded

        this.data = data;

        this.data.servers.map((server, index) => (server.server_id = index)); // handle servers id

        this.timestamps = this.data.timestampPoints.map(secs => secs * 1000); // change seconds to milliseconds
      } else if(data.message == 'updateServers') {

        if(!data) { // check if has any data
          return;
        }

        if(this.timestamps.length >= 16) {
          this.timestamps.shift();
        }
        this.timestamps.push(data.timestamp * 1000);

        for(let i = 1; i < data.updates.length; i++) {
          this.handleServerUpdate(data, this.data.servers[i], i);
        }
      }
    });

    this.webSocketService.connectionStatus$().subscribe(status => {
      if(!status) {
        this.data = undefined as any;
        this.timestamps = [];
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

    if(server.playerCountHistory.length >= 16) {
      server.playerCountHistory.shift();
    }
    server.playerCountHistory.push(data.updates[server_id].playerCount);
  }

  getDataSet(server: ServerData) {
    return {
      labels: this.timestamps,
      datasets: [
        {
          data: server.playerCountHistory,
          fill: true,
          tension: 0.1,
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
