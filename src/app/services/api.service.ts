import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs';
import { CacheService } from 'ionic-cache';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private alertCtrl:AlertController,private cache: CacheService) { }

  ObtenerLista(){
    let us = JSON.parse(localStorage.getItem('user'));
    let param = {id_usuario : us.id};
    let url = environment.apiUrl + "/api/lista/get/activa/app";
    let cacheKey = url;
    let request = this.http.post(url,param);
    // return this.cache.loadFromObservable(cacheKey, request);
     return this.http.post<any>(url, param);
  }

  login(data){
    return this.http.post<any>(
    environment.apiUrl + "/api/auth/loginAPP", data);
  }

  ObtenerListaUsuarios(){
  
    let param = {};
    return this.http.post<any>(
    environment.apiUrl + "/api/users/usuarios", param);
  }
}
