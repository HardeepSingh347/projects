import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorForm } from 'src/app/models/errorform.model';
import { NgForm } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  isLoadingAuth,
  getUserId,
  getAuthError,
} from 'src/app/store/auth/auth.selectors';
import { AppState } from 'src/app/store';
import { resetPassword } from 'src/app/store/auth/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  loadingSubscription: Subscription;
  errorSubscription: Subscription;
  userIdSubscription: Subscription;
  loginErrors: ErrorForm;
  errorLogin = false;
  loading = false;
  userId: string;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.errorSubscription = this.store.pipe(select(getAuthError)).subscribe((error) => {
      if (error) {
        this.loginErrors = error;
        this.errorLogin = true;
      }
    });
    this.loadingSubscription = this.store.pipe(select(isLoadingAuth)).subscribe((loading) => {
      this.loading = loading;
    });
    this.userIdSubscription = this.store.pipe(select(getUserId)).subscribe((userId) => {
      this.userId = userId;
    });
  }

  onValidateOTP = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    this.store.dispatch(
      resetPassword({ userId: this.userId, password: form.value.password })
    );
  }

  ngOnDestroy = () => {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }
}
