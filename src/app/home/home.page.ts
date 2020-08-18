import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, NavController, IonSlides, Platform } from '@ionic/angular';
import { LoadingController, AlertController, ToastController} from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { environment } from "../../environments/environment";
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import * as Moment from 'moment';
import { NetworkService } from '../services/network.service';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild('slideHome') slider: IonSlides;

timeAwait = 8000;
slideOpts = {
  on: {
    beforeInit() {
      const swiper = this;
      swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
      const overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: true,
      };
      swiper.params = Object.assign(swiper.params, overwriteParams);
      swiper.params = Object.assign(swiper.originalParams, overwriteParams);
    },
    setTranslate() {
      const swiper = this;
      const { slides } = swiper;
      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = swiper.slides.eq(i);
        const offset$$1 = $slideEl[0].swiperSlideOffset;
        let tx = -offset$$1;
        if (!swiper.params.virtualTranslate) tx -= swiper.translate;
        let ty = 0;
        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
        }
        const slideOpacity = swiper.params.fadeEffect.crossFade
          ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
          : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
        $slideEl
          .css({
            opacity: slideOpacity,
          })
          .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
      }
    },
    setTransition(duration) {
      const swiper = this;
      const { slides, $wrapperEl } = swiper;
      slides.transition(duration);
      if (swiper.params.virtualTranslate && duration !== 0) {
        let eventTriggered = false;
        slides.transitionEnd(() => {
          if (eventTriggered) return;
          if (!swiper || swiper.destroyed) return;
          eventTriggered = true;
          swiper.animating = false;
          const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
          for (let i = 0; i < triggerEvents.length; i += 1) {
            $wrapperEl.trigger(triggerEvents[i]);
          }
        });
      }
    },
  }
}
  videoOption: VideoOptions = {
    volume: 0.7
  }
  loading: any;
  ishiden=true;
  isLoadingPresent: boolean = false;
  lista = []
  ruta = environment.baseApi+'/storage/app/public/archivos/';

  hiddenVideo = true;
  isConnected = false;
  constructor(public navCtrl: NavController,
    private androidFullScreen: AndroidFullScreen,
    public loadingController: LoadingController, 
    public alertCtrl: AlertController,
    public apiS: ApiService,
    public platform: Platform,
    private videoPlayer: VideoPlayer,
    private networkService: NetworkService,
    public toastCtrl : ToastController,
    private streamingMedia: StreamingMedia) {
      this.initializeApp();
      
     }
     ngOnDestroy(){
      localStorage.clear();
     }

     ngOnInit(){
     
      Moment.locale('es');
      
      this.getLista();
      setTimeout( () => {
        this.initTime();
     }, 1000)
    
      this.ocultarBarras();
      

    }
    
    initTime= ()=>{
      setTimeout( () => {
          let ac = Moment().format('LT');
          let hminD = Moment('00:00', 'HH:mm').format('LT');
          let hmaxD = Moment('00:30', 'HH:mm').format('LT');
          let hminN = Moment('12:00', 'HH:mm').format('LT');
          let hmaxN = Moment('12:30', 'HH:mm').format('LT');
          if((ac > hminN && ac < hmaxN) || (ac > hminD && ac < hmaxD) ){
            this.getLista();
          }
        
          this.initTime();
     }, 600000)
     }
    ocultarBarras(){
      this.androidFullScreen.isImmersiveModeSupported()
      .then(() => this.androidFullScreen.immersiveMode())
      .catch(err => console.log(err));
    }

    initializeApp() {  
      this.platform.backButton.subscribe(()=>{
        this.presentAlertConfirm();
      });
    }
   async getLista(){
     this.displayLoading();
     await this.apiS.ObtenerLista().subscribe((res)=>{
       this.dismissLoading();
       this.lista= res;
      //  if(data){
        
      //   data.forEach(element => {
      //     if(element.Archivo != ""){
      //       let d = element.Archivo
      //       d.forEach(ele => {
      //         this.lista.push(ele)
      //       });
      //     }
          
      //   });
      //   // this.lista=data;

      //  }
    
      if(this.lista && this.lista.length > 0){
        if(this.lista.length==1 && this.lista[0].tipo == 1){
          this.timeAwait = 2000;
         
          this.openVideo(this.lista[0].ruta,1);
        }else{
          if(this.lista[0].tipo == 1){
            this.timeAwait = 2000;
            this.openVideo(this.lista[0].ruta);
          }else{
            if(this.lista[0].tipoTiempo == 's'){
              this.timeAwait = this.lista[0].tiempo*1000;
            }else if(this.lista[0].tipoTiempo == 'm'){
              this.timeAwait = this.lista[0].tiempo*60000;
            }else{
              this.timeAwait = 2000;
            }
              this.nextSlide();
          }
        }
      }
     },(error)=>{
       this.dismissLoading();
       console.log(error);
       this.presentAlert("Error Inseperado", "Contacte con soporte")
     })
   }
   async openVideo(name,reproducir=0){
    // console.log('playyy');
    this.connected();
    if(this.isConnected){
      let options: StreamingVideoOptions = {
        successCallback: () => { 
          console.log('reprodujo')
              setTimeout(() => {
            if(reproducir==1){
              this.openVideo(name,1)
            }else{
            this.slider.isEnd().then((val)=>{
              if(val){
                this.slider.slideTo(0);
              }else{
                this.slider.slideNext();
              }
            })
          }
          }, 2000);
        },
        errorCallback: (e) => {   
          console.log('se gurio')  
          this.slider.isEnd().then((val)=>{
          if(val){
            this.slider.slideTo(0);
          }else{
            this.slider.slideNext();
          }
        })
      },
        orientation: 'landscape',
        shouldAutoClose: true,
        controls: false
      };
      this.streamingMedia.playVideo(this.ruta+name, options);
    // await this.videoPlayer.play(this.ruta+name, this.videoOption).then((res) => {
    //   console.log("fin", res);
    //   setTimeout(() => {
    //     if(reproducir==1){
    //       this.openVideo(name,1)
    //     }else{
    //     this.slider.isEnd().then((val)=>{
    //       if(val){
    //         this.slider.slideTo(0);
    //       }else{
    //         this.slider.slideNext();
    //       }
    //     })
    //   }
    //   }, 2000);
    //  },(error)=>{
    //   console.log("erooooo",error)
    //   this.videoPlayer.close();
    //    if(error == "OK"){
    //     setTimeout(() => {
    //       this.slider.isEnd().then((val)=>{
    //         if(val){
    //           this.slider.slideTo(0);
    //         }else{
    //           this.slider.slideNext();
    //         }
    //       })
    //     }, 2000);
    //    }
    //   console.log("error",error);
    //  });
    }else{
      console.log('no hay conexion')  
      this.slider.isEnd().then((val)=>{
      if(val){
        this.slider.slideTo(0);
      }else{
        this.slider.slideNext();
      }
    })
    }
   }
   slideChange(){
     this.slider.getActiveIndex().then(value =>{
     
      if(this.lista[value].tipo == 1){
        this.openVideo(this.lista[value].ruta);
      }else{
  
        if(this.lista[value].tipoTiempo == 's'){
          this.timeAwait = this.lista[value].tiempo*1000;
        }else if(this.lista[value].tipoTiempo == 'm'){
          this.timeAwait = this.lista[value].tiempo*60000;
        }else{
          this.timeAwait = 2000;
        }
        this.nextSlide();
      }
     });
     
   }
   nextSlide(){
    
    setTimeout(() => {
      this.slider.isEnd().then((val)=>{
    
        if(val){
          this.slider.slideTo(0);
        }else{
          this.slider.slideNext();
        }
      })
    }, this.timeAwait);
   }
   prevSlide(){
     this.slider.slidePrev();
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

   async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar!',
      message: '<strong>¿Desea cerrar la sesion?</strong>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }
  connected(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        this.displayToastButton('Por favor enciende tu conexión a Internet');
          console.log('Por favor enciende tu conexión a Internet');
      }else{
        this.displayToastButton('Conectado a Internet');
      }
    });
  }
    /**
   * Método para mostrar un mensaje en pantalla con botón
   * @param text Mensaje del Toast
   * @param buttonText Texto del botón
   * @param position Posición UtilitiesProvider.POS_TOP - UtilitiesProvider.POS_MIDDLE - UtilitiesProvider.POS_BOTTOM
   */
  async displayToastButton(text, buttonText?: string, position?: 'top' | 'middle' | 'bottom') {
    let btnTxt = 'OK';
    let pos: 'top' | 'middle' | 'bottom' = 'bottom';
    if (buttonText) {
      btnTxt = buttonText;
    }
    if (position) {
      pos = position;
    }
    const toast = await this.toastCtrl.create({
      message: text,
      duration:5000,
      cssClass: "toastMid",
      position: pos,
    });

    toast.present();
  }
}
