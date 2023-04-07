import { Injectable } from '@angular/core';
import { Observable, Observer, Subject, timer, using, from, BehaviorSubject } from 'rxjs';
import { filter, tap, map, take, switchMap, retryWhen, repeat, distinctUntilChanged, takeUntil, skip, } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private status$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private ws: any;

  _address: string = 'wss://masivo.cc'
  _reconnectDelayBase = 0;
  _message = 'Loading...';

  public messages$: Subject<any> = new Subject<any>();

  constructor() {}

  handleCreate() {
    this.create();
    this.connectionStatus$().pipe(
      skip(1),
      filter(status => !status),
      tap(() => this.create()),
    ).subscribe();
  }

  public connectionStatus$(): Observable<boolean> {
    return this.status$.pipe(distinctUntilChanged());
  }

  private create() {
    if (this.ws) {
      this.ws.unsubscribe()
    }

    const retryConnection = switchMap(() => {
      this.status$.next(false);

      this._reconnectDelayBase++

      // Exponential backoff for reconnection attempts
      // Clamp ceiling value to 30 seconds
      let _reconnectDelaySeconds = Math.min((this._reconnectDelayBase * this._reconnectDelayBase), 30);

      this.handleOverlayText(_reconnectDelaySeconds);

      return timer(_reconnectDelaySeconds * 1000);
    });

    const openObserver = new Subject<Event>();
    openObserver.pipe(map((_) => true)).subscribe(this.status$);
    
    const closeObserver = new Subject<CloseEvent>();
    closeObserver.pipe(map((_) => false)).subscribe(this.status$);

    this.ws = webSocket<any>({
      url: this._address,
      openObserver,
      closeObserver,
    });

    this.ws.pipe(retryWhen((errs) => errs.pipe(retryConnection, repeat()))).subscribe(this.messages$);
  }

  handleOverlayText(_reconnectDelaySeconds: number) {
    const reconnectInterval = setInterval(() => {
      _reconnectDelaySeconds--

      if (_reconnectDelaySeconds === 0) {
        // Explicitly clear interval, this avoids race conditions
        // #clearInterval first to avoid potential errors causing pre-mature returns
        clearInterval(reconnectInterval)

        // Update displayed text
        this._message = 'Reconnecting...';

      } else if (_reconnectDelaySeconds > 0) {
        // Update displayed text
        this._message = `Reconnecting in ${_reconnectDelaySeconds}s...`; // Update displayed text
      }
    }, 1000)
  }

  message(message: any) {
    this.connectionStatus$().pipe(
      filter(status => status),
      tap(() => this.ws.next(message)),
      take(1)
    ).subscribe();
  }
}
