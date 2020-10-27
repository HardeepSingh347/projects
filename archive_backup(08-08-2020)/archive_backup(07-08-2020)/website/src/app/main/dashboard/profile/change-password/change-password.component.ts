import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorForm } from 'src/app/models/errorform.model';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { getAuthError, isLoadingAuth } from 'src/app/store/auth/auth.selectors';
import { NgForm } from '@angular/forms';
import { changePassword } from 'src/app/store/auth/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  loadingSubscription: Subscription;
  errorSubscription: Subscription;
  errorLogin = false;
  loginErros: ErrorForm;
  loading = false;
  newPassword: string;
  confirmPassword: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.errorSubscription = this.store.pipe(select(getAuthError)).subscribe((error) => {
      if (error) {
        this.errorLogin = true;
        this.loginErros = error;
      }
    });
    this.loadingSubscription = this.store.pipe(select(isLoadingAuth)).subscribe((loading) => {
      this.loading = loading;
    });
  }

  onChangePassword = (form: NgForm) => {
    if (form.invalid || this.newPassword !== this.confirmPassword) {
      return;
    }
    this.store.dispatch(
      changePassword({
        currentPassword: form.value.currentPassword,
        newPassword: form.value.newPassword,
      })
    );
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
