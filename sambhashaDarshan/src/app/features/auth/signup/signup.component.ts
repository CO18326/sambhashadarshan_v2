import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Socket } from 'ngx-socket-io';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private socket : Socket,
    private sessionService : SessionService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      displayName: new FormControl('', [Validators.minLength(3)]),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.minLength(6)]),
    })
  }

  signUp() {

    
    this.auth.signUp(this.form.value).subscribe({
      next: (data) => {this.sessionService.storeUser(data);   this.auth.ee.emit(1); this.router.navigate(['chat'])},
      error: (error) => this.snackbar.open(error.message)
    });
  }

}
