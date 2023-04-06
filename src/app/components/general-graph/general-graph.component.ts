import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import * as moment from 'moment';

@Component({
  selector: 'app-general-graph',
  templateUrl: './general-graph.component.html',
  styleUrls: ['./general-graph.component.css']
})
export class GeneralGraphComponent {

  initialized = false;

  @Input() generalData!: any;
  @Input() graphData!: any;

  public chart: any;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
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
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour'
            }
          }
        }
      },
      
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    if(changes['graphData']) {
      this.handleGeneralGraph();
    }

    //this.handleCharts();
  }

  handleGeneralGraph() {

    if(!this.graphData) {
      return;
    }

    let dataset = [];

    for(let i = 0; i < this.generalData.servers.length; i++) {
      
      dataset.push({
        label: this.generalData.config.servers[i].name,
        fill: true,
        data: this.graphData.graphData[i],
        borderColor: this.generalData.config.servers[i].color,
        tension: 1,
        pointStyle: 'circle',
        pointRadius: 0,
        pointHoverRadius: 3
      })
    }

    let date: string[] = [];
    this.graphData.timestamps.forEach((timestamp: number) => {
      date.push(moment(timestamp * 1000).toString());
    });

    this.chart.data.datasets = dataset;
    this.chart.data.labels = date;
    this.chart.update();
  }

  handleCharts() {

  }
}
