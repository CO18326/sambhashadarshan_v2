import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SessionService } from '../../session.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit {
  
  form!: FormGroup;
  
  
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private sessionService : SessionService,
    private socket : Socket
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(6)]),
    })
  }

  errorcheck(data:any){
    if(data.status!=200){
      this.snackbar.open(data.msg)
      return 0;
    }
    return 1;

  }

  signIn() {
    //this.socket.emit("hello",{"a":12,"b":13})
    this.auth.signIn(this.form.value).subscribe({
      next: (data) => {if(this.errorcheck(data)){this.sessionService.storeUser(data);  this.auth.ee.emit(1); this.router.navigate(['chat']);}},
      error: (error) => this.snackbar.open(error.message)
    });
  }

}
