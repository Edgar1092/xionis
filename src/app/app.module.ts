import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './services/auth-guard.service';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

import { Network } from '@ionic-native/network/ngx';
import { StreamingMedia} from '@ionic-native/streaming-media/ngx';
import { CacheModule } from "ionic-cache";


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,CacheModule.forRoot({ keyPrefix: 'cacheIonic4' })],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ApiService,
    AndroidFullScreen,
    AuthGuardService,
    Network,
    StreamingMedia
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
