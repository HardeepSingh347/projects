import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AppState } from "../store";
import { Store, select } from "@ngrx/store";
import { isDocumentLoaded } from "../store/document/document.selectors";
import { tap, filter, first, finalize } from "rxjs/operators";
import { loadingDocuments } from "../store/document/document.actions";
import { Observable } from "rxjs";

@Injectable()
export class DocumentResolver implements Resolve<any> {
  loading = false;
  constructor(private store: Store<AppState>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const documentType = route.params.type;
    const forDate = route.queryParams.forDate;
    const sector = route.queryParams.sector;
    const period = route.queryParams.period;
    const search = route.queryParams.search;
    return this.store.pipe(
      select(isDocumentLoaded),
      tap((loaded) => {
        if (!this.loading) {
          this.loading = true;
          this.store.dispatch(
            loadingDocuments({ documentType, forDate, sector, period, search })
          );
        }
      }),
      filter((loaded) => loaded),
      first(),
      finalize(() => (this.loading = false))
    );
  }
}
