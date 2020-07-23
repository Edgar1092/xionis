import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavParams, NavController  } from '@ionic/angular';
import { LoadingController, AlertController} from '@ionic/angular';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public formGroup: FormGroup;
  isLoadingPresent = false
  loading
  constructor(public navCtrl: NavController,
    public loadingController: LoadingController, 
    public alertCtrl: AlertController,
    public apiS: ApiService,
    private fb: FormBuilder) {
      this.formGroup = this.fb.group({
        email: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.required])]
      });
     }
    
  ngOnInit() {
    
  }
  ionViewDidEnter(){
    localStorage.clear();
   }
  async iniciarSesion() {
    this.displayLoading();
    let data = this.formGroup.value;
    // this.service.loginp(data);
    try {
      // Iniciamos la consulta
      this.apiS.login(data).subscribe((res: any) => {
        //Almacenamos en local storage el nombre del usuario
        console.log(res)
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));
        this.navCtrl.navigateRoot('/');
        this.dismissLoading();
      }, e => {
        //En caso de error
        this.dismissLoading();
        this.presentAlert("Error Inseperado", e.error.message ? e.error.message : "Contacte con soporte");
        console.error(e);
      })

    }
    catch (e) {
      this.dismissLoading();
      this.presentAlert("Error Inseperado", e.error.message ? e.error.message : "Contacte con soporte");
      console.error(e);
    }

  }
  async displayLoading(message?: string, duration?: number) {
    if(!this.isLoadingPresent){
    try {
      this.loading = await this.loadingController.create({
        message: message ? message : 'Cargando',
        duration: duration ? duration : 5000
      });
      await this.loading.present();
      this.isLoadingPresent = true;
    } catch (error) {
      console.error(error);
    }
  }

  }
  async dismissLoading() {
    if(this.isLoadingPresent){
    try {
      await this.loading.dismiss();
      this.isLoadingPresent = false;
    } catch (error) {
    }
  }
  }
  async presentAlert(titulo,contenido) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: contenido,
      buttons: ['OK']
    });

    await alert.present();
  }
}
