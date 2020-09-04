import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { CacheService } from 'ionic-cache';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alertCtrl: AlertController,
    cache: CacheService,
    private androidFullScreen: AndroidFullScreen,
    private autostart: Autostart

  ) {
    this.initializeApp();
    cache.setDefaultTTL(60 * 60); 
    cache.setOfflineInvalidate(false);
   
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.autostart.enable();
    });

  }


}
