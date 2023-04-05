import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralGraphComponent } from './components/general-graph/general-graph.component';
import { ServerGraphComponent } from './components/server-graph/server-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    GeneralGraphComponent,
    ServerGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
