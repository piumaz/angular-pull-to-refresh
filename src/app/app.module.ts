import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PullToRefreshModule} from 'pull-to-refresh';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PullToRefreshModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
