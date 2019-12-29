# @piumaz/pull-to-refresh

Provides an Angular component and service, for the Pull-To-Refresh feature like on Chrome

`npm install @piumaz/pull-to-refresh`
____
## Module

Import PullToRefreshModule in AppModule:
```
import {PullToRefreshModule} from '@piumaz/pull-to-refresh';

@NgModule({
  imports: [
    PullToRefreshModule
  ],
})
export class AppModule { }
```

## Component

Add component in your template, for example in _app.component.html_.

Based on document scrollTop:
```
<pull-to-refresh></pull-to-refresh>

<h1>Pull-To-Refresh example</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
```

```
body {
  overscroll-behavior-y: none;
}
```

Or based on target element .scrollTop property:

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

Component has 'refresh' output property, emit when user pull to refresh:

```
<pull-to-refresh (refresh)='myRefreshFunction()'></pull-to-refresh>
```

## Service
Import and use PullToRefreshService for subscribe to observable refresh$:
```
import { PullToRefreshService } from 'pull-to-refresh';
```

```
export class AppComponent {

  constructor(private pullToRefreshService: PullToRefreshService) {

    pullToRefreshService.refresh$().subscribe(() => {
      console.log('refresh by observable');
    });

  }
}
```
## Event
An event dispatch too, when user pull to refresh:

```
export class AppComponent {

  constructor(private pullToRefreshService: PullToRefreshService) {

    document.addEventListener('pull-to-refresh', () => {
      console.log('refresh by eventListener');
    });

  }
}
```

