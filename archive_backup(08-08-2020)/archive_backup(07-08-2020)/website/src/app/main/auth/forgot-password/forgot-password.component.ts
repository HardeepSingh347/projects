import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorForm } from 'src/app/models/errorform.model';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { NgForm } from '@angular/forms';
import { forgotPassword } from 'src/app/store/auth/auth.actions';
import { isLoadingAuth, getAuthError } from 'src/app/store/auth/auth.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  loadingSubscription: Subscription;
  errorSubscription: Subscription;
  loginErrors: ErrorForm;
  errorLogin = false;
  loading = false;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loadingSubscription = this.store.pipe(select(isLoadingAuth)).subscribe((loading) => {
      this.loading = loading;
    });

    this.errorSubscription = this.store.pipe(select(getAuthError)).subscribe(error => {
      if (error) {
        this.errorLogin = true;
        this.loginErrors = error;
      }
    });
  }

  onForgotPassword = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    this.store.dispatch(forgotPassword({email: form.value.email }));
  }

  ngOnDestroy = () => {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }
}
