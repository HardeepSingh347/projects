import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { isUserLoaded } from '../store/user/user.selectors';
import { tap, first, finalize, filter } from 'rxjs/operators';
import { loadingUsers } from '../store/user/user.actions';

@Injectable()
export class UserResolver implements Resolve<any> {
  loading = false;
  constructor(private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.store.pipe(
      select(isUserLoaded),
      tap((loaded) => {
        if (!loaded && !this.loading) {
          this.loading = true;
          return this.store.dispatch(loadingUsers());
        }
      }),
      filter((loaded) => loaded),
      first(),
      finalize(() => (this.loading = false))
    );
  }
}
