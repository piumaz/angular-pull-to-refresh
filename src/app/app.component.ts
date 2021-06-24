import { Component } from '@angular/core';
import { PullToRefreshService } from '@piumaz/pull-to-refresh';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private pullToRefreshService: PullToRefreshService) {

    pullToRefreshService.refresh$().subscribe(() => {
      console.log('refresh by observable');
    });

    document.addEventListener('pull-to-refresh', () => {
      console.log('refresh by eventListener');
    });
  }
}
