import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AppState } from '../store';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isCompanyLoaded } from '../store/company/company.selectors';
import { tap, filter, first, finalize } from 'rxjs/operators';
import { loadingCompanies } from '../store/company/company.actions';

@Injectable()
export class CompanyResolver implements Resolve<any> {
  loading = false;

  constructor(private store: Store<AppState>) {}

  resolve = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> => {
    return this.store.pipe(
      select(isCompanyLoaded),
      tap((loaded) => {
        if (!loaded && !this.loading) {
          this.loading = true;
          return this.store.dispatch(loadingCompanies());
        }
      }),
      filter((loaded) => loaded),
      first(),
      finalize(() => (this.loading = false))
    );
  }
}
