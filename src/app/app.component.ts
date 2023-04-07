import { Component } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { WebSocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Minecraft-Tracker';

  constructor(
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.webSocketService.handleCreate();

    this.webSocketService.messages$.subscribe(data => {
        if(data.message == 'init') {
          this.webSocketService.message('requestHistoryGraph');
        }
        console.log(data);
      }
    );
  }
}
