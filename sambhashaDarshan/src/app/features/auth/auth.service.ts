import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { updateProfile } from '@firebase/auth';
import { BehaviorSubject, forkJoin, from, pluck, switchMap } from 'rxjs';
import { SigninCredentials, SignupCredentials } from './auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState = new BehaviorSubject<Object | null>(null);

  ee: EventEmitter<number> = new EventEmitter<number>();
  
  readonly isLoggedIn$ = authState(this.auth);

  constructor(private auth: Auth, private http: HttpClient) { }

  getStreamToken() {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/createStreamToken`, {
      user: this.getCurrentUser()
    }).pipe(pluck('token'))
  }

  getCurrentUser() {
    return this.auth.currentUser!;
  }

  signIn({ email, password }: SigninCredentials) {
    return  this.http.post(
      `${environment.apiUrl}/signin`, 
      { email,password})
  }

  signUp({ email, password, displayName }: SignupCredentials) {
    return this.http.post(
          `${environment.apiUrl}/signup`, 
          { email,password, displayName })
  }

  signOut(user_id: any) {
    const user = this.auth.currentUser;
    return this.http.post(
      `${environment.apiUrl}/logout`, 
      {user_id })

  }
}
