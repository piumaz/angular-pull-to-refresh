import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PullToRefreshService {

  private refresh: Subject<boolean>;
  private reset: Subject<boolean>;

  constructor() {
    this.refresh = new Subject<boolean>();
    this.reset = new Subject<boolean>();
  }

  public refresh$(): Observable<boolean> {
    return this.refresh.asObservable();
  }

  public pull(): void {
    this.refresh.next(true);
  }

  public reset$(): Observable<boolean> {
    return this.reset.asObservable();
  }

  public dismiss(): void {
    this.reset.next(true);
  }
}
