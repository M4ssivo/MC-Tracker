import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public subject!: WebSocketSubject<any>;

  constructor() { }

  connect$() {
    if (!this.subject) {
      this.subject = webSocket('wss://masivo.cc');
    }
    return this.subject;
  }
}
