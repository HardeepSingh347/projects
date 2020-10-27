import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AppState } from '../store';
import { isLoggedIn } from '../store/auth/auth.selectors';
import { logout } from '../store/auth/auth.actions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(isLoggedIn),
      tap((loggedIn) => {
        if (!localStorage.getItem('user') || !loggedIn) {
          this.store.dispatch(logout());
          this.router.navigate(['auth', 'login'], {
            queryParams: {
              returnToUrl: state.url,
            },
          });
        }
      })
    );
  }
}
