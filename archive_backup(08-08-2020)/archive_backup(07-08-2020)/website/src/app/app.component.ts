import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { loginSuccess, forgotPasswordSuccess, otpValidationSuccess } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loading = true;
  title = 'website';

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit() {
    const userProfile = localStorage.getItem('user');
    const otpId = localStorage.getItem('otpId');
    const userId = localStorage.getItem('userId');
    if (userProfile) {
      this.store.dispatch(loginSuccess({ user: JSON.parse(userProfile) }));
    }

    if (otpId) {
      this.store.dispatch(forgotPasswordSuccess({ otpId: JSON.parse(otpId) }));
    }
    if (userId) {
      this.store.dispatch(otpValidationSuccess({ userId: JSON.parse(userId) }));
    }

    // Loader
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
