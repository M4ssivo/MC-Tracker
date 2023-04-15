import { Component } from '@angular/core';
import { WebSocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Minecraft-Tracker';
  showOverlay = true;

  constructor(private webSocketService: WebSocketService) {
    this.handleLoad();
  }

  handleLoad() {
    this.webSocketService.handleCreate();

    this.webSocketService.messages$.subscribe(data => {
        if(data.message == 'init') {
          this.webSocketService.message('requestHistoryGraph');
        }
      }
    );

    this.webSocketService.connectionStatus$().subscribe(status => {
      if(!status) {
        this.showOverlay = true;
        if(!this.hasError()) {
          this.webSocketService._message = 'Disconnected due to error.';
        }
      } else {
        this.showOverlay = false;
        this.webSocketService._message = '';
      }
    });
  }

  shouldShowOverlay() {
    return this.hasError() && this.showOverlay;
  }

  getOverlayText() {
    return this.webSocketService._message;
  }

  hasError() {
    return this.webSocketService._message || this.webSocketService._message != '';
  }
}
