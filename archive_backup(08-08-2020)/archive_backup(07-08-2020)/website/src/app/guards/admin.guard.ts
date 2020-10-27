import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { AppState } from "../store";
import { isAdminLoggedIn } from "../store/auth/auth.selectors";
import { logout } from "../store/auth/auth.actions";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(isAdminLoggedIn),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigate(["dashboard"]);
        }
      })
    );
  }
}
