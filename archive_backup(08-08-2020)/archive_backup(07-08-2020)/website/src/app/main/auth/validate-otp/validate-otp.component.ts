import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorForm } from 'src/app/models/errorform.model';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import {
  isLoadingAuth,
  getOtpId,
  getAuthError,
} from 'src/app/store/auth/auth.selectors';
import { otpValidation } from 'src/app/store/auth/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-validate-otp',
  templateUrl: './validate-otp.component.html',
  styleUrls: ['./validate-otp.component.css'],
})
export class ValidateOtpComponent implements OnInit, OnDestroy {
  loadingSubscription: Subscription;
  errorSubscription: Subscription;
  otpIdSubscription: Subscription;
  loginErrors: ErrorForm;
  errorLogin = false;
  loading = false;
  otpId: string;
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
    this.otpIdSubscription = this.store.pipe(select(getOtpId)).subscribe((otpId) => {
      this.otpId = otpId;
    });
  }

  onValidateOTP = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    this.store.dispatch(
      otpValidation({ otpId: this.otpId, otp: form.value.otp })
    );
  }

  ngOnDestroy = () => {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.otpIdSubscription) {
      this.otpIdSubscription.unsubscribe();
    }
  }
}
