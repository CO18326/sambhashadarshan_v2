import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './features/auth/auth.service';
import { Location } from '@angular/common';
import { SessionService } from './features/session.service';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'get-stream-io-draft';
  nav_bar_show: boolean = false;
  user: any ="";
  login: any=0;
  constructor(public auth: AuthService, private router: Router, private location:Location,private sessionService: SessionService,private socket:Socket) {}
  ngOnInit() :void{

    this.nav_bar_show = this.location.path() != "/videoCall"

    if(this.sessionService.getUser()){
      this.login=1;
      this.user=this.sessionService.getUser()
      this.socket.emit("sign_in",{user_id:this.sessionService.getUser()})
    }

    this.auth.ee.subscribe(counter => {
      this.login=counter;
      this.user=this.sessionService.getUser()
    });

  }
  signOut() {
    this.login=0;
    this.auth.signOut(this.sessionService.getUser()).subscribe({
      next: () => {this.sessionService.deleteUser();this.router.navigate(['signin']);}
    });
  }
}
