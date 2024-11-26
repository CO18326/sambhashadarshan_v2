import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(private http:HttpClient) { }



  getusers(rootuserid:any){

    return this.http.post(
      `${environment.apiUrl}/getUsers`, 
      {rootuserid});

  }
}
