import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PullToRefreshService {

  private refresh: Subject<boolean>;

  constructor() {
    this.refresh = new Subject<boolean>();
  }

  public refresh$(): Observable<boolean> {
    return this.refresh.asObservable();
  }

  public pull(): void {
    // console.log('Refresh');
    this.refresh.next(true);
  }


}
