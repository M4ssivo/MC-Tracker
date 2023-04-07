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

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.connect$().subscribe({
      next: data => {
        if(data.message == 'init') {
          this.apiService.connect$().next('requestHistoryGraph');
        }
      }, error: err => {
        console.log(err);
      }
    });
  }
}
