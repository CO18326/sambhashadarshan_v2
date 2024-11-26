import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private socket: Socket) { }


  storeUser(data:any){
    sessionStorage.setItem("user_id",data.id);
    this.socket.emit("sign_in",{"user_id":data.id})
  }

  getUser(){
    return sessionStorage.getItem("user_id");
  }

  deleteUser(){
    sessionStorage.clear();
  }
}
