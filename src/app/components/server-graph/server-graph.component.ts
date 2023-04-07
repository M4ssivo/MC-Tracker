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

  @Input() generalData!: any;

  data!: GeneralData;

  public lineChartOptions: ChartOptions<'line'> = {
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
    this.apiService.connect().subscribe({
      next: msg => {
        const data = JSON.parse(JSON.stringify(msg));
        if(data.message == 'init') {
          this.data = data;
        }
      }, error: err => {
        console.log(err);
      }
    });
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
