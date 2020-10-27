import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AppState } from "../store";
import { Store, select } from "@ngrx/store";
import { isDocTypeLoaded } from "../store/doc-type/doc-type.selectors";
import { tap, finalize, filter, first } from "rxjs/operators";
import { loadingDocTypes } from "../store/doc-type/doc-type.actions";

@Injectable()
export class DocTypeResolver implements Resolve<any> {
  loading = false;

  constructor(private store: Store<AppState>) {}

  resolve = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return this.store.pipe(
      select(isDocTypeLoaded),
      tap((docLoaded) => {
        if (!docLoaded && !this.loading) {
          this.loading = true;
          return this.store.dispatch(loadingDocTypes());
        }
      }),
      filter((docLoaded) => docLoaded),
      first(),
      finalize(() => (this.loading = false))
    );
  };
}
