import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

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
    private autostart: Autostart,
    private androidFullScreen: AndroidFullScreen
  ) {
    this.initializeApp();
   
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.autostart.enable();
      this.ocultarBarras()
    });

    this.platform.backButton.subscribe(()=>{

    });
  }

  ocultarBarras(){
    this.androidFullScreen.isImmersiveModeSupported()
    .then(() => this.androidFullScreen.immersiveMode())
    .catch(err => console.log(err));
  }
}
