import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, NavController, IonSlides, Platform } from '@ionic/angular';
import { LoadingController, AlertController} from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { environment } from "../../environments/environment";
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import * as Moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild('slideHome') slider: IonSlides;
  // slideOpts = {
  //   initialSlide: 0,
  //   slidesPerView: 1,
  //   autoplay: false,
  //   speed: 2000
  // };
timeAwait = 8000;
   slideOpts = {
  on: {
    beforeInit() {
      const swiper = this;
      swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
      const overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: true,
      };
      swiper.params = Object.assign(swiper.params, overwriteParams);
      swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
    },
    setTranslate() {
      const swiper = this;
      const { $, slides, rtlTranslate: rtl } = swiper;
      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = slides.eq(i);
        let progress = $slideEl[0].progress;
        if (swiper.params.flipEffect.limitRotation) {
          progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
        }
        const offset$$1 = $slideEl[0].swiperSlideOffset;
        const rotate = -180 * progress;
        let rotateY = rotate;
        let rotateX = 0;
        let tx = -offset$$1;
        let ty = 0;
        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
          rotateX = -rotateY;
          rotateY = 0;
        } else if (rtl) {
          rotateY = -rotateY;
        }

         $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

         if (swiper.params.flipEffect.slideShadows) {
          // Set shadows
          let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
          let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
          if (shadowBefore.length === 0) {
            shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`);
            $slideEl.append(shadowBefore);
          }
          if (shadowAfter.length === 0) {
            shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`);
            $slideEl.append(shadowAfter);
          }
          if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
          if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
        }
        $slideEl
          .transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
      }
    },
    setTransition(duration) {
      const swiper = this;
      const { slides, activeIndex, $wrapperEl } = swiper;
      slides
        .transition(duration)
        .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
        .transition(duration);
      if (swiper.params.virtualTranslate && duration !== 0) {
        let eventTriggered = false;
        // eslint-disable-next-line
        slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
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
    }
  }
};
  videoOption: VideoOptions = {
    volume: 0.7
  }
  loading: any;
  ishiden=true;
  isLoadingPresent: boolean = false;
  lista: any
  ruta = environment.baseApi+'/storage/app/public/archivos/';
  constructor(public navCtrl: NavController,
    private androidFullScreen: AndroidFullScreen,
    public loadingController: LoadingController, 
    public alertCtrl: AlertController,
    public apiS: ApiService,
    private videoPlayer: VideoPlayer,
    public platform: Platform) {
      this.initializeApp();
     }
     ngOnDestroy(){
      localStorage.clear();
     }
     ionViewDidEnter(){
    
      // this.openVideo();
     }
     ionViewDidLeave(){
       localStorage.clear();
     }
     ngOnInit(){
      Moment.locale('es');
      let ac = Moment().format('LT');
      let hmin = Moment('00:00', 'HH:mm').format('LT');
      let hmax = Moment('01:00', 'HH:mm').format('LT');
      console.log('AC', ac);
      console.log('HMin', hmin);
      console.log('HMax', hmax);
      if(ac > hmin && ac < hmax){
        console.log('Hora de actualizar');
      }
      
      this.getLista();
      setTimeout( () => {
        // this.obtenerNoti();
        this.initTime();
     }, 1000)
    
      this.ocultarBarras();
      

    }
    initTime= ()=>{
      setTimeout( () => {
          // this.getLocation()
          let ac = Moment().format('LT');
          let hmin = Moment('00:00', 'HH:mm').format('LT');
          let hmax = Moment('00:30', 'HH:mm').format('LT');
          if(ac > hmin && ac < hmax){
            console.log('Hora de actualizar');
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
      this.lista = res.Archivo;
      // this.slideChange();
      if(this.lista && this.lista.length > 0){
          if(parseInt(this.lista[0].tipo) == 1){
            // this.ishiden=false;
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
       console.log("Lista =>",this.lista);
     },(error)=>{
       this.dismissLoading();
       console.log(error);
       this.presentAlert("Error Inseperado", "Contacte con soporte")
     })
   }
   async openVideo(name){
    this.ocultarBarras();
     console.log(this.ruta+name);
    this.videoPlayer.play(this.ruta+name, this.videoOption).then(() => {
      console.log('video completed');
      this.videoPlayer.close();
      setTimeout(() => {
        this.slider.isEnd().then((val)=>{
          if(val){
            this.slider.slideTo(0);
          }else{
            this.slider.slideNext();
          }
        })
      }, 2000);
     }).catch(err => {
      this.videoPlayer.close();
       if(err == "OK"){
        setTimeout(() => {
          this.slider.isEnd().then((val)=>{
            if(val){
              this.slider.slideTo(0);
            }else{
              this.slider.slideNext();
            }
          })
        }, 2000);
       }
      console.log("error",err);
     });
     
   }
   slideChange(){
     this.slider.getActiveIndex().then(value =>{
      console.log("slide cambio",value);
      if(parseInt(this.lista[value].tipo) == 1){
        this.openVideo(this.lista[value].ruta);
      }else{
        console.log("imagen");
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
     
    //  console.log("slide cambio",this.slider.getActiveIndex());
   }
   nextSlide(){
    
    setTimeout(() => {
      this.slider.isEnd().then((val)=>{
        console.log("ultimo",val)
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
}
