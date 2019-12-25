# @piumaz/pull-to-refresh


## Component

### Based on document scrollTop:
Template
```
<pull-to-refresh></pull-to-refresh>

<h1>Pull-To-Refresh example</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
```
Style
```
body {
  overscroll-behavior-y: none;
}
```
### Based on target element .scrollTop property:

```
<pull-to-refresh [config]="{
    'target: '#content'
}"></pull-to-refresh>

<div id="content">
    <h1>Pull-To-Refresh example</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>
```
```
body {
  overscroll-behavior-y: none;
  overflow: hidden;
}

#content {
  overflow-y: scroll;
  height:100vh;
}
```
## Service
```
import { PullToRefreshService } from 'pull-to-refresh';
```

```
export class AppComponent {

  constructor(private pullToRefreshService: PullToRefreshService) {

    pullToRefreshService.refresh$().subscribe(() => {
      console.log('refresh');
    });

  }
}
```
