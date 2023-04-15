import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { GeneralData } from 'src/app/models/generaldata';
import { HistoryGraph } from 'src/app/models/historygraph';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-general-graph',
  templateUrl: './general-graph.component.html',
  styleUrls: ['./general-graph.component.css']
})
export class GeneralGraphComponent {

  initialized = false;

  generalData!: GeneralData;
  historyGraph!: HistoryGraph;

  public chart: any;

  constructor(
    private webSocketService: WebSocketService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.handleCreateChart();

    this.webSocketService.messages$.subscribe(data => {
      if(data.message == 'init') {
        this.generalData = data;
      } else if(data.message == 'historyGraph') {
        this.historyGraph = data;
        this.handleHistoryGraph();
      } else if(data.message == 'updateServers') {
        this.handleUpdate(data)
      }
    });

    this.webSocketService.connectionStatus$().subscribe(status => {
      if(!status) {
        this.generalData = undefined as any;
        this.historyGraph = undefined as any;
        this.initialized = false;
      }
    });
  }

  handleCreateChart() {
    this.chart = new Chart('general-graph', {
      type: 'line',
      data: {
        datasets: [],
        labels: []
      },
      options: {
        spanGaps: true,
        normalized: true,
        animation: false,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        
      },
      
    });
  }

  handleHistoryGraph() {

    if(!this.historyGraph) {
      return;
    }

    let dataset = [];

    for(let i = 0; i < this.generalData.servers.length; i++) {
      
      dataset.push({
        label: this.generalData.config.servers[i].name,
        fill: true,
        data: this.historyGraph.graphData[i],
        borderColor: this.generalData.config.servers[i].color,
        backgroundColor: 'transparent',
        tension: 1,
        pointStyle: 'circle',
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: this.generalData.config.servers[i].color
      })
    }

    let date: string[] = [];
    this.historyGraph.timestamps.forEach((timestamp: number) => {
      date.push(new Date(timestamp * 1000).toLocaleTimeString());
    });

    this.chart.data.datasets = dataset;
    this.chart.data.labels = date;
    this.chart.update();

    this.initialized = true;
  }

  handleUpdate(data: any) {

    if(!this.generalData || !this.historyGraph || !this.initialized) {
      return;
    }

    this.chart.data.labels.shift();
    this.chart.data.labels.push(new Date(data.timestamp * 1000).toLocaleTimeString());

    for(let i = 1; i < data.updates.length; i++) {
      this.chart.data.datasets[i].data.shift();
      this.chart.data.datasets[i].data.push(data.updates[i].playerCount);
    }
    this.chart.update();
  }
}
