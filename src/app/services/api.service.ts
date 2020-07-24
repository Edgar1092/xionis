import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private alertCtrl:AlertController) { }

  ObtenerLista(){
    let us = JSON.parse(localStorage.getItem('user'));
    let param = {id_usuario : us.id};
    return this.http.post<any>(
    environment.apiUrl + "/api/lista/get/activa/app", param);
  }

  login(data){
    return this.http.post<any>(
    environment.apiUrl + "/api/auth/login", data);
  }

  ObtenerListaUsuarios(){
  
    let param = {};
    return this.http.post<any>(
    environment.apiUrl + "/api/users/usuarios", param);
  }
}
