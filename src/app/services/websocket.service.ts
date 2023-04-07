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
  _caption = 'Loading...';

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

      this._caption = `Reconnecting in ${_reconnectDelaySeconds}s...`; // Update displayed text

      console.log(this._caption);

      return timer(_reconnectDelaySeconds * 1000);
    });

    this._caption = 'Reconnecting...'; // Update displayed text

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

  message(message: any) {
    this.connectionStatus$().pipe(
      filter(status => status),
      tap(() => this.ws.next(message)),
      take(1)
    ).subscribe();
  }
}
