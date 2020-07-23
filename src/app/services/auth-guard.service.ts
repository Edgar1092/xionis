import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private navCtrl: NavController) { }

  canActivate() {
    //Validamos que existe un usuario en el localstorage almacenado
    let token = localStorage.getItem('token');
    if (token) {
        return true;
    } else {
      this.navCtrl.navigateRoot('/login');
      return false;
        
    }
}
}
