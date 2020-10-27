import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { login } from 'src/app/store/auth/auth.actions';
import { ErrorForm } from 'src/app/models/errorform.model';
import { getAuthError, isLoadingAuth } from 'src/app/store/auth/auth.selectors';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loadingSubscription: Subscription;
  errorSubscription: Subscription;
  returnToUrl: string;
  loginErrors: ErrorForm;
  errorLogin = false;
  loading = false;
  email: string;
  password: string;
  secretKey: string;
  type = 'password';
  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.secretKey = environment.cryptoSecretKey;
    const encryptedSecret = localStorage.getItem('remembered');

    if (encryptedSecret) {
      const credentials = JSON.parse(
        CryptoJS.AES.decrypt(encryptedSecret, this.secretKey.trim()).toString(
          CryptoJS.enc.Utf8
        )
      );
      this.email = credentials.email;
      this.password = credentials.password;
    }
    this.loadingSubscription = this.store
      .pipe(select(isLoadingAuth))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.errorSubscription = this.store
      .pipe(select(getAuthError))
      .subscribe((error) => {
        if (error) {
          this.loginErrors = error;
          this.errorLogin = true;
        }
      });
    // this.returnToUrl = this.route.queryParams;
    this.route.queryParams.subscribe((params) => {
      this.returnToUrl = params.returnToUrl;
    });
  }

  onLogin = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    const secret = {
      email: form.value.email,
      password: form.value.password,
    };
    if (form.value.rememberMe === true) {
      const encryptedSecret = CryptoJS.AES.encrypt(
        JSON.stringify(secret),
        this.secretKey.trim()
      ).toString();
      localStorage.setItem('remembered', encryptedSecret);
    } else {
      if (localStorage.getItem('remembered')) {
        localStorage.removeItem('remembered');
      }
    }
    this.store.dispatch(login({ data: secret, returnToUrl: this.returnToUrl }));
  }

  onChangeType = () => {
    if (this.type === 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
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
