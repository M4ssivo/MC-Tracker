import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralGraphComponent } from './components/general-graph/general-graph.component';
import { ServerGraphComponent } from './components/server-graph/server-graph.component';
import { NgChartsModule } from 'ng2-charts';
import { OverlayComponent } from './components/overlay/overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    GeneralGraphComponent,
    ServerGraphComponent,
    OverlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
