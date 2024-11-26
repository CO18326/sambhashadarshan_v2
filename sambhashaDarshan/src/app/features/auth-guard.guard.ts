import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  
  constructor(private sessionService : SessionService,private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if(this.sessionService.getUser()){
    
    if(state.url=="/signin" || state.url=="/signup"){
      this.router.navigate(["/chat"]);
    }
      return true;
    }

    else{
      if(state.url=="/signin" || state.url=="/signup"){
        return true;
      }
    
    
      this.router.navigate(["/signin"]); 
    return false;

    }
  }
  }
  

